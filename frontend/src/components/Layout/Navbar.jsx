import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../../main";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
// import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { useWebSocket } from "../../websocketprovider";
import { ToastContainer, toast } from "react-toastify";
import { Button, notification, Space } from "antd";
import "./Navbar.css";
// import openNotification from "../chat/components/notification";
const close = () => {
  console.log(
    "Notification was closed. Either the close button was clicked or duration time elapsed."
  );
};
const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigate = useNavigate();
  const customId = "custom-id-yes";
  ////////////////////////
  const [api, contextHolder] = notification.useNotification();
  const { socket } = useWebSocket();
  const { addUser } = useWebSocket();
  // const [data, setData] = useState({});
  var datanew = {};
  ////////////////
  const acceptfunction = () => {
    console.log("accept function");
    navigate(`/room/${datanew.roomid}`);
  };
  const rejectfunction = () => {
    // console.log(data.name);
    console.log(datanew.senderid);
    const user = JSON.parse(localStorage.getItem("user"));
    const { _id, name } = user;
    console.log(socket);
    socket.emit("send-rej", {
      to: datanew.senderid,
      from: _id,
      msg: { senderid: _id, senderName: name },
    });
  };

  const Msg = ({ closeToast, toastProps }) => (
    <div>
      User {datanew.sendername} has invited you to a video call
      <br></br>
      <button className="button-1" onClick={() => acceptfunction()}>
        Accept
      </button>
      <button
        className="button-2"
        onClick={() => {
          rejectfunction();
          closeToast();
        }}
      >
        Reject
      </button>
      {/* <button className="button-3" onClick={closeToast}>
        Close
      </button> */}
    </div>
  );

  // const openNotification = (data) => {
  //   console.log("notification is triggered");
  //   const roomId = data.roomid;
  //   const key = `open${Date.now()}`;
  //   const btn = (
  //     <Space>
  //       <Button
  //         type="link"
  //         size="small"
  //         onClick={() => {
  //           const user = JSON.parse(localStorage.getItem("user"));
  //           const { _id, name } = user;
  //           socket.emit("send-rej", {
  //             to: data.senderid,
  //             from: _id,
  //             msg: { senderid: _id, senderName: name },
  //           });
  //           api.destroy();
  //         }}
  //       >
  //         Reject
  //       </Button>
  //       <Button
  //         type="primary"
  //         size="small"
  //         onClick={() => navigate(`/user/room/${roomId}`)}
  //       >
  //         Accept
  //       </Button>
  //     </Space>
  //   );
  //   notification.config({
  //     maxCount: 1,
  //   });
  //   api.open({
  //     message: "Video call notification",
  //     description: `${data.senderName} is inviting you on a video call`,
  //     btn,
  //     key,
  //     duration: 20,

  //     onClose: close,
  //   });
  // };
  // ////////////
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = socket;
    console.log("toast hora byy");
    // data.name = "talha";

    // const data = "talha mc phir bazi le gya ";
    // setData=name: "talha mc phir bazi le gya";

    if (socketRef.current) {
      const userData = JSON.parse(localStorage.getItem("user"));
      console.log(socket);
      socketRef.current.on("connect", () => {
        console.log("Connected to server");
        console.log(socket);
        // const userData = JSON.parse(localStorage.getItem("user"));
        addUser(userData._id);
      });
      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from server");
      });
      // socket.emit("send-noti", {
      //   to: "65ef1e63f98ec0e2eae4ee1a",
      //   from: userData._id,
      //   msg: "fuckyouuuuuuuuuuuuuuuuuuuuuuuuuuuuu uu",
      // });
      socketRef.current.on("recieve-noti", (data) => {
        console.log("Received notification:", data);
        // openNotification(data);
        datanew = data;
        console.log(datanew);
        toast(<Msg />, {
          toastId: customId,
        });
      });
    }
  }, [socket]);

  ///////////////////////////
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      // toast.success(response.data.message);
      setIsAuthorized(false);
      navigate("/login");
    } catch (error) {
      // toast.error(error.response.data.message), setIsAuthorized(true);
      console.log(error);
    }
  };

  return (
    <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
      {contextHolder}
      <ToastContainer autoClose={20000} />
      <div className="container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <h2>HireSync</h2>
            <span className="logo-tagline">Find Your Future</span>
          </Link>
        </div>
        <ul className={!show ? "menu" : "show-menu menu"}>
          <li>
            <NavLink to={"/"} onClick={() => setShow(false)}>
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink to={"/job/getall"} onClick={() => setShow(false)}>
              ALL JOBS
            </NavLink>
          </li>
          <li>
            <NavLink to={"/applications/me"} onClick={() => setShow(false)}>
              {user && user.role === "Employer"
                ? "APPLICATIONS"
                : "MY APPLICATIONS"}
            </NavLink>
          </li>
          {user && user.role === "Employer" ? (
            <>
              <li>
                <NavLink to={"/job/post"} onClick={() => setShow(false)}>
                  POST JOB
                </NavLink>
              </li>
              <li>
                <NavLink to={"/job/me"} onClick={() => setShow(false)}>
                  MY JOBS
                </NavLink>
              </li>
            </>
          ) : (
            <></>
          )}
          <li>
            <NavLink to={"/chat"} onClick={() => setShow(false)}>
              MESSAGES
            </NavLink>
          </li>
          <button onClick={handleLogout}>LOGOUT</button>
        </ul>
        <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow(!show)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
