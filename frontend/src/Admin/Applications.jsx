import  { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../main';
import { useNavigate } from "react-router-dom";

const Applications = () => {
  const navigateTo = useNavigate();
  const { isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);

  const fetchApplications = () => {
    axios.get('http://localhost:4000/api/v1/application/admin/getAll',
    {
      withCredentials: true,
    })
      .then(response => {
        console.log('Applications Response:', response.data);
        setApplications(response.data.applications);
      })
      .catch(error => {
        console.error('Error fetching applications:', error);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);
  if (!isAuthorized) {
    navigateTo("/login");
  }

  return (
    <div className="Applications">
      <h6>Applications</h6>
      <table>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Cover Letter</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(application => (
            <tr key={application._id}>
              <td>{application.jobId}</td>
              <td>{application.name}</td>
              <td>{application.email}</td>
              <td>{application.coverLetter}</td>
              <td>{application.phone}</td>
              <td>{application.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Applications;
