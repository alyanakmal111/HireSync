import { useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      axios.post(
        "http://localhost:4000/api/v1/user/password/forgot",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      .then((response) => {
        toast.success("Email sent successfully");
        setEmail("");
        setErrors({});
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    }
  };

  return (
    <>
      <Toaster />
      <section className="authPage">
        <div className="container">
          <div className="header">
            <h3>Forget your account?</h3>
          </div>
          <form onSubmit={handleSubmit}>
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
            <button type="submit">
              Submit
            </button>
          </form>
        </div>
        <div className="banner">
          <img src="/forget.avif" alt="login" />
        </div>
      </section>
    </>
  );
};

export default ForgetPassword;
