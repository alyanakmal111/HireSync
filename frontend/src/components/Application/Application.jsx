// import axios from "axios";
// import React, { useContext, useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate, useParams } from "react-router-dom";
// import { Context } from "../../main";
// import Navbar from "../Layout/Navbar";
// const Application = () => {
 
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [coverLetter, setCoverLetter] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [resume, setResume] = useState(null);

//   const { isAuthorized, user } = useContext(Context);

//   const navigateTo = useNavigate();

//   const FileUpload = () => {
//     const [file, setFile] = useState(null);
  
//     const handleFileChange = (event) => {
//       setFile(event.target.files[0]);
//     };
  
//     const handleFileUpload = async () => {
//       if (!file) {
//         alert('Please select a file');
//         return;
//       }
  
//       const formData = new FormData();
//       formData.append('resume', file);
  
//       try {
//         const response = await axios.post('http://localhost:4000/api/v1/application/saveDocumentToServer', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         console.log(response.data);
//         // Handle success
//       } catch (error) {
//         console.error('Error uploading file:', error);
//         // Handle error
//       }
//     };

//   // const FileUpload = () => {
//   //   const [file, setFile] = useState(null);
//   // }
  
//   //   const handleFileChange = (event) => {
//   //     setFile(event.target.files[0]);
//   //   };
  
//   //   const handleFileUpload = async () => {
//   //     alert("hello")
//   //     const formData = new FormData();
//   //     formData.append('resume', file);
//   //     try {
//   //       const response = await axios.post('http://localhost:4000/api/v1/application/saveDocumentToServer', formData, {
//   //         headers: {
//   //           'Content-Type': 'multipart/form-data',
//   //         },
//   //       });
//   //       console.log(response.data);
//   //       // Handle success
//   //     } catch (error) {
//   //       console.error('Error uploading file:', error);
//   //       // Handle error
//   //     }
//   //   };

//   const { id } = useParams();
//   const handleApplication = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("phone", phone);
//     formData.append("address", address);
//     formData.append("coverLetter", coverLetter);
//     formData.append("resume", resume);
//     formData.append("jobId", id);

//     try {
//       console.log(formData)
//       const { data } = await axios.post(
//         "http://localhost:4000/api/v1/application/post",
//         formData,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setName("");
//       setEmail("");
//       setCoverLetter("");
//       setPhone("");
//       setAddress("");
//       setResume("");
//       toast.success(data.message);
//       navigateTo("/job/getall");
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   if (!isAuthorized || (user && user.role === "Employer")) {
//     navigateTo("/");
//   }

//   return (
//     <div>
//       <Navbar />
   
//     <section className="application">
//       <div className="container">
//         <h3>Application Form</h3>
//         <form onSubmit={handleApplication}>
//           <input
//             type="text"
//             placeholder="Your Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <input
//             type="email"
//             placeholder="Your Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Your Phone Number"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Your Address"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//           />
//           <textarea
//             placeholder="CoverLetter..."
//             value={coverLetter}
//             onChange={(e) => setCoverLetter(e.target.value)}
//           />
//           <div>
//             <label
//               style={{ textAlign: "start", display: "block", fontSize: "20px" }}
//             >
//               Select Resume
//             </label>
//             <input
//               type="file"
//               accept=".pdf, .jpg, .JPEG .png"
//               onChange={handleFileUpload}
//               style={{ width: "100%" }}
//             />
//           </div>
//           <button type="submit">Send Application</button>
//         </form>
//       </div>
//     </section>
//     </div>
//   );
// };

// export default Application


import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";
import Navbar from "../Layout/Navbar";
import axios from "axios";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState("");
  const [file, setFile] = useState(null);
  const [jobDetails, setJobDetails] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { jobId } = useParams();

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/job/${jobId}`, {
          withCredentials: true,
        });
        setJobDetails(response.data.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:4000/api/v1/application/saveDocumentToServer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResume(response.data.url);
      toast.success('Resume uploaded successfully!');
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    
    if (!resume) {
      toast.error('Please upload your resume before submitting.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", jobId);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume("");
      setFile(null);
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  return (
    <>
      <Navbar />
      <section className="application-page">
        <div className="application-container">
          {/* Back Navigation */}
          <div className="back-navigation">
            <button onClick={() => navigateTo(-1)} className="back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Job Details
            </button>
          </div>

          {/* Application Header */}
          <div className="application-header">
            <h1 className="application-title">Apply for Position</h1>
            {jobDetails.title && (
              <div className="job-info-header">
                <h2 className="job-title-header">{jobDetails.title}</h2>
                <p className="job-company-header">{jobDetails.category} • {jobDetails.city}, {jobDetails.country}</p>
              </div>
            )}
            <p className="application-subtitle">Take the next step in your career journey</p>
          </div>

          {/* Application Form */}
          <div className="application-form-card">
            <form onSubmit={handleApplication} className="application-form">
              <div className="form-section">
                <h3 className="section-title">Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="address">Full Address *</label>
                  <textarea
                    id="address"
                    placeholder="Enter your complete address including street, city, state/province, postal code, and country"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="3"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Cover Letter</h3>
                <div className="form-group">
                  <label htmlFor="coverLetter">Tell us why you&apos;re the perfect fit *</label>
                  <textarea
                    id="coverLetter"
                    placeholder="Write a compelling cover letter that highlights your relevant experience and passion for this role..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows="6"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Resume Upload</h3>
                <div className="file-upload-section">
                  <label htmlFor="resume">Upload Your Resume *</label>
                  <div className="file-upload-area">
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <div className="file-upload-content">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      <p className="upload-text">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="upload-subtext">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  </div>
                  
                  {file && !resume && (
                    <button 
                      type="button" 
                      onClick={handleFileUpload} 
                      className="upload-btn"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <div className="spinner"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Upload Resume
                        </>
                      )}
                    </button>
                  )}

                  {resume && (
                    <div className="upload-success">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                      Resume uploaded successfully!
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting || !resume}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2l-7 20-4-9-9-4z"/>
                        <path d="M22 2l-11 9"/>
                      </svg>
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Application;
