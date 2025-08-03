
import React, { useContext } from 'react';
import '../App.css'; 
import { Context } from "../main";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Sidebar({ setSelectedTab }) {
  const {  setIsAuthorized } = useContext(Context);
  const navigate = useNavigate();
  const handleClick = (tab) => {
    setSelectedTab(tab);
  };
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
      navigate("/admin/login");
    } catch (error) {
      // toast.error(error.response.data.message), setIsAuthorized(true);
      console.log(error);
    }
  };
  return (
    <div className="Sidebar">
        <h5>HireSync</h5>
      <ul>
        <li onClick={() => handleClick('user')}>User</li>
        <li onClick={() => handleClick('jobs')}>Jobs</li>
        <li onClick={() => handleClick('applications')}>Applications</li>
        <button className='adminLogout' onClick={handleLogout}>Logout</button>
      </ul>
    </div>
  );
}

export default Sidebar;

