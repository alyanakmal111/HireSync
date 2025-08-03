import  { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import Chat from "../src/chat/pages/Chat.jsx";
import SetAvatar from "./chat/components/SetAvatar.jsx";
import Room from "./chat/Room/Room.jsx";
import CreateTest from "./components/Test/CreateTest.jsx";
import GetTest from "./components/Test/GetTest.jsx";
import Admin from "./Admin/Admin.jsx";
import Users from "./Admin/Users.jsx";
import Applications from "./Admin/Applications.jsx";
import AdminJobs from "./Admin/AdminJobs.jsx";
import AdminLogin from "./components/Auth/AdminLogin.jsx";
import ForgetPassword from "./components/Auth/ForgetPassword.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          {
            withCredentials: true,
          }
        );

        setUser(response.data.user);
        // localStorage.setItem(JSON.stringify("user", response.data.user));
        setIsAuthorized(true);
        // localStorage.setItem(JSON.stringify("user", response.data.user));
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);

  return (
    <>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/setAvatar" element={<SetAvatar />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="room/:roomid" element={<Room />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:jobId" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="/createTest" element={<CreateTest />} />
          <Route path="/getTest" element={<GetTest />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/applications" element={<Applications />} />
        </Routes>
        {/* <Footer /> */}
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
