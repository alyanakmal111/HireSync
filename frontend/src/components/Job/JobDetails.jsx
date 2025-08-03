import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import Navbar from "../Layout/Navbar";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigateTo("/notfound");
      });
  }, [id, navigateTo]);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="job-details-loading">
          <div className="loading-spinner"></div>
          <p>Loading job details...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="job-details-page">
        <div className="job-details-container">
          {/* Back Navigation */}
          <div className="back-navigation">
            <button onClick={() => navigateTo(-1)} className="back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Jobs
            </button>
          </div>

          {/* Job Header */}
          <div className="job-header-card">
            <div className="job-header-content">
              <div className="job-title-section">
                <h1 className="job-title">{job.title}</h1>
                <div className="job-meta">
                  <span className="job-category">{job.category}</span>
                  <span className="job-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {job.city}, {job.country}
                  </span>
                  <span className="job-posted">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Posted: {new Date(job.jobPostedOn).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="salary-section">
                <div className="salary-info">
                  <span className="salary-label">Salary</span>
                  <span className="salary-amount">
                    {job.fixedSalary ? (
                      `$${job.fixedSalary.toLocaleString()}`
                    ) : (
                      `$${job.salaryFrom?.toLocaleString()} - $${job.salaryTo?.toLocaleString()}`
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="job-details-grid">
            {/* Job Description */}
            <div className="job-description-card">
              <h2 className="section-title">Job Description</h2>
              <div className="description-content">
                <p>{job.description}</p>
              </div>
            </div>

            {/* Job Information Sidebar */}
            <div className="job-info-sidebar">
              <div className="job-info-card">
                <h3 className="info-title">Job Information</h3>
                <div className="info-items">
                  <div className="info-item">
                    <span className="info-label">Department</span>
                    <span className="info-value">{job.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">{job.location}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">City</span>
                    <span className="info-value">{job.city}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Country</span>
                    <span className="info-value">{job.country}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Posted Date</span>
                    <span className="info-value">{new Date(job.jobPostedOn).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Apply Section */}
              {user && user.role !== "Employer" && (
                <div className="apply-card">
                  <h3 className="apply-title">Ready to Apply?</h3>
                  <p className="apply-description">
                    Take the next step in your career journey.
                  </p>
                  <Link to={`/application/${job._id}`} className="apply-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
                      <rect x="2" y="9" width="20" height="12" rx="2" ry="2"/>
                    </svg>
                    Apply Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobDetails;
