import  { useState, useEffect, useContext } from 'react';
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import '../App.css'; 
import { Context } from '../main';
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigateTo = useNavigate();
  const { isAuthorized } = useContext(Context);
  const [users, setUsers] = useState([]);
  
  
  const fetchUsers = () => {
    axios.get('http://localhost:4000/api/v1/user/getAllUsersData',
    {
      withCredentials: true,
    })
      .then(response => {
        console.log('Response:', response.data);
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  if (!isAuthorized) {
    navigateTo("/login");
  }


  return (
    <div className="User">
      <h6>Users</h6>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.phone}</td>
              {/* <button onClick={() => handleDeleteUser(user._id)}><MdDelete /></button> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
