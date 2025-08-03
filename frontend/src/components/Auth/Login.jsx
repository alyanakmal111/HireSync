import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import toast from "react-hot-toast";
import '../../App.css'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!role) {
      newErrors.role = "Please select a role";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      setErrors({});
      setIsAuthorized(true);

      if (data.user.role === "Admin") {
        return <Navigate to="/admin" />;
      } else {
        return <Navigate to="/" />;
      }
    } catch (error) {
      console.log(error);
      const backendErrors = error.response?.data?.errors || { general: error.response?.data?.message || error.message };
      setErrors(backendErrors);
      toast.error(backendErrors.general);
    }
  };

  if (isAuthorized) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <h3>Login to your account</h3>
          </div>
          <form onSubmit={handleLogin}>
            {errors.general && <p className="error">{errors.general}</p>}
            <div className="inputTag">
              <label>Login As</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                  {/* <option value="Admin">Admin</option> */}
                </select>
                <FaRegUser />
              </div>
              {errors.role && <p className="error">{errors.role}</p>}
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="zk@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <button type="submit">Login</button>
            <div className="forget" id="forget">
              <Link to={"/ForgetPassword"}>Forget Password?</Link>
            </div>
            <Link to={"/register"}>Register Now</Link>
          </form>
        </div>
        <div className="banner">
          <img src="/login.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default Login;
