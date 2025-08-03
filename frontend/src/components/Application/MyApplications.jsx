import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import { sendMessageRoute } from "../../chat/utils/APIRoutes";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        if (user && user.role === "Employer") {
          const res = await axios.get("http://localhost:4000/api/v1/application/employer/getall", {
            withCredentials: true,
          });
          setApplications(res.data.applications);
        } else {
          const res = await axios.get("http://localhost:4000/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          });
          setApplications(res.data.applications);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchApplications();
    }
  }, [isAuthorized, user]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setApplications((prevApplication) =>
        prevApplication.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete application");
    }
  };

  const GetTest = async (id, applicationId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/test/getTest/${id}`);
      localStorage.setItem("jobId", id);
      localStorage.setItem("application", applicationId);
      toast.success(res.data.message);
      navigateTo("/getTest");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load test");
    }
  };

  const messageApplication = async (sender, receiver, status, id) => {
    try {
      if (!status) {
        await axios.post(sendMessageRoute, {
          from: sender,
          to: receiver,
          message: "We are reviewing your application",
        });
        await axios.post(
          `http://localhost:4000/api/v1/application/updateMessageStatus`,
          { id: id }
        );
        toast.success("Message sent successfully");
      }
      navigateTo("/chat");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="applications-loading">
          <div className="loading-spinner"></div>
          <p>Loading applications...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="my-applications-page">
        <div className="my-applications-container">
          {/* Back Navigation */}
          <div className="back-navigation">
            <button onClick={() => navigateTo(-1)} className="back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back
            </button>
          </div>

          {/* Page Header */}
          <div className="applications-header">
            <h1 className="applications-title">
              {user && user.role === "Job Seeker" ? "My Applications" : "Applications From Job Seekers"}
            </h1>
            <p className="applications-subtitle">
              {user && user.role === "Job Seeker" 
                ? "Track your job applications and their status" 
                : "Manage applications from candidates"}
            </p>
            <div className="applications-count">
              {applications.length} application{applications.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Applications List */}
          <div className="applications-list">
            {applications.length <= 0 ? (
              <div className="no-applications">
                <svg className="no-apps-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                <h3>No Applications Found</h3>
                <p>
                  {user && user.role === "Job Seeker" 
                    ? "You haven't applied to any jobs yet. Start exploring opportunities!" 
                    : "No applications have been submitted for your job postings yet."}
                </p>
                {user && user.role === "Job Seeker" && (
                  <button onClick={() => navigateTo("/job/getall")} className="explore-jobs-btn">
                    Explore Jobs
                  </button>
                )}
              </div>
            ) : (
              applications.map((element) => (
                user && user.role === "Job Seeker" ? (
                  <JobSeekerCard
                    element={element}
                    key={element._id}
                    deleteApplication={deleteApplication}
                    GetTest={GetTest}
                  />
                ) : (
                  <EmployerCard
                    element={element}
                    key={element._id}
                    messageApplication={messageApplication}
                  />
                )
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

const JobSeekerCard = ({ element, deleteApplication, GetTest }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="application-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="application-status">
          <span className="status-badge status-pending">Pending Review</span>
        </div>
        <div className="application-date">
          Applied: {new Date(element.createdAt || Date.now()).toLocaleDateString()}
        </div>
      </div>

      {/* Application Details */}
      <div className="card-content">
        <div className="applicant-info">
          <div className="info-row">
            <div className="info-item">
              <label>Name</label>
              <span>{element.name}</span>
            </div>
            <div className="info-item">
              <label>Email</label>
              <span>{element.email}</span>
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-item">
              <label>Phone</label>
              <span>{element.phone}</span>
            </div>
            <div className="info-item">
              <label>Location</label>
              <span>{element.address}</span>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="cover-letter-section">
          <label>Cover Letter</label>
          <div className="cover-letter-content">
            {expanded ? element.coverLetter : `${element.coverLetter?.slice(0, 200)}${element.coverLetter?.length > 200 ? '...' : ''}`}
            {element.coverLetter?.length > 200 && (
              <button onClick={toggleExpanded} className="expand-btn">
                {expanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>

        {/* Resume Download */}
        {element.resume && (
          <div className="resume-section">
            <label>Resume</label>
            <a
              href={`http://localhost:4000/uploads/${element.resume}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="resume-download-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Resume
            </a>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        <button onClick={() => GetTest(element.jobId, element._id)} className="action-btn test-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Take Test
        </button>
        <button onClick={() => deleteApplication(element._id)} className="action-btn delete-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6"/>
            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
          Delete Application
        </button>
      </div>
    </div>
  );
};

const EmployerCard = ({ element, messageApplication }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="application-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="applicant-name">
          <h3>{element.name}</h3>
          <span className="applicant-role">Job Applicant</span>
        </div>
        <div className="application-date">
          Applied: {new Date(element.createdAt || Date.now()).toLocaleDateString()}
        </div>
      </div>

      {/* Application Details */}
      <div className="card-content">
        <div className="applicant-info">
          <div className="info-row">
            <div className="info-item">
              <label>Email</label>
              <span>{element.email}</span>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <span>{element.phone}</span>
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-item full-width">
              <label>Address</label>
              <span>{element.address}</span>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="cover-letter-section">
          <label>Cover Letter</label>
          <div className="cover-letter-content">
            {expanded ? element.coverLetter : `${element.coverLetter?.slice(0, 300)}${element.coverLetter?.length > 300 ? '...' : ''}`}
            {element.coverLetter?.length > 300 && (
              <button onClick={toggleExpanded} className="expand-btn">
                {expanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>

        {/* Resume Download */}
        {element.resume && (
          <div className="resume-section">
            <label>Resume</label>
            <a
              href={`http://localhost:4000/uploads/${element.resume}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="resume-download-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Resume
            </a>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        <button
          onClick={() =>
            messageApplication(
              element.employerID?.user,
              element.applicantID?.user,
              element.messageSent,
              element._id
            )
          }
          className="action-btn message-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          {element.messageSent ? 'Continue Chat' : 'Send Message'}
        </button>
      </div>
    </div>
  );
};

export default MyApplications;
