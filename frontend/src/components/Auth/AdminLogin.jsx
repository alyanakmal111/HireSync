import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import '../../App.css'; 

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const { setIsAuthorized } = useContext(Context);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (!email) {
      setEmailError("Please fill in the email address");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Please fill in the password");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!role) {
      setRoleError("Please select the role");
      isValid = false;
    } else if (role !== "Admin") {
      setRoleError("Please select the Admin role");
      isValid = false;
    } else {
      setRoleError("");
    }

    if (!isValid) {
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
      setIsAuthorized(true);

      if (data.user.role === "Admin") {
        navigate("/admin"); // Navigate to /admin
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <h3>Login to your account</h3>
          </div>
          <form onSubmit={handleLogin}>
            <div className="inputTag">
              <label>Login As Admin</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                </select>
                <FaRegUser />
              </div>
              {roleError && <p className="error">{roleError}</p>}
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
              {emailError && <p className="error">{emailError}</p>}
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
              {passwordError && <p className="error">{passwordError}</p>}
            </div>
            <button type="submit">Login</button>
            <div className="forget" id="forget">
          <Link to={"/ForgetPassword"}>Forget Password?</Link>
        </div>
          </form>
        </div>
        <div className="banner">
          <img src="/login.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default AdminLogin;
