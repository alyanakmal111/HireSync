import  { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Context } from '../main';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigateTo = useNavigate();
  const { isAuthorized } = useContext(Context);
  const fetchJobs = () => {
    axios.get('http://localhost:4000/api/v1/job/getAllJobsAdmin',
    {
      withCredentials: true,
    })
      .then(response => {
        console.log('Response:', response.data.jobs);
        setJobs(response.data.jobs);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
      });
  };
  
  useEffect(() => {
    fetchJobs();
  }, []);
  if (!isAuthorized) {
    navigateTo("/login");
  }


  
  return (
    <div className="Jobs">
      <h6>Jobs</h6>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Country</th>
            <th>City</th>
            <th>Location</th>
            <th>Description</th>
            <th>Fixed Salary</th>
            <th>Posted On</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.category}</td>
              <td>{job.country}</td>
              <td>{job.city}</td>
              <td>{job.location}</td>
              <td>{job.description}</td>
              <td>{job.fixedSalary}</td>
              {/* <td>{job.jobPostedOn}</td> */}
              <td>{new Date(job.jobPostedOn.split('T')[0]).toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminJobs;
