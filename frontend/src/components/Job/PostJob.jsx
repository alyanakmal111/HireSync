// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { Context } from "../../main";
// import Navbar from "../Layout/Navbar";
// const PostJob = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [country, setCountry] = useState("");
//   const [city, setCity] = useState("");
//   const [location, setLocation] = useState("");
//   const [salaryFrom, setSalaryFrom] = useState("");
//   const [salaryTo, setSalaryTo] = useState("");
//   const [fixedSalary, setFixedSalary] = useState("");
//   const [salaryType, setSalaryType] = useState("default");

//   const { isAuthorized, user } = useContext(Context);

//   const handleJobPost = async (e) => {
//     e.preventDefault();
//     if (salaryType === "Fixed Salary") {
//       setSalaryFrom("");
//       setSalaryFrom("");
//     } else if (salaryType === "Ranged Salary") {
//       setFixedSalary("");
//     } else {
//       setSalaryFrom("");
//       setSalaryTo("");
//       setFixedSalary("");
//     }
//     await axios
//       .post(
//         "http://localhost:4000/api/v1/job/post",
//         fixedSalary.length >= 4
//           ? {
//               title,
//               description,
//               category,
//               country,
//               city,
//               location,
//               fixedSalary,
//             }
//           : {
//               title,
//               description,
//               category,
//               country,
//               city,
//               location,
//               salaryFrom,
//               salaryTo,
//             },
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       .then((res) => {
//         toast.success(res.data.message);
//         localStorage.setItem("jobId", res.data.job._id)
//         console.log(res.data.job._id)
        
//         navigateTo("/createTest")
//       })
//       .catch((err) => {
//         toast.error(err.response.data.message);
//       });
//   };

//   const navigateTo = useNavigate();
//   if (!isAuthorized || (user && user.role !== "Employer")) {
//     navigateTo("/");
//   }

//   return (
//     <>
//     <Navbar />
//       <div className="job_post page">
//         <div className="container">
//           <h3>POST NEW JOB</h3>
//           <form onSubmit={handleJobPost}>
//             <div className="wrapper">
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Job Title"
//               />
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               >
//                 <option value="">Select Category</option>
//                 <option value="Graphics & Design">Graphics & Design</option>
//                 <option value="Mobile App Development">
//                   Mobile App Development
//                 </option>
//                 <option value="Frontend Web Development">
//                   Frontend Web Development
//                 </option>
//                 <option value="MERN Stack Development">
//                   MERN STACK Development
//                 </option>
//                 <option value="Account & Finance">Account & Finance</option>
//                 <option value="Artificial Intelligence">
//                   Artificial Intelligence
//                 </option>
//                 <option value="Video Animation">Video Animation</option>
//                 <option value="MEAN Stack Development">
//                   MEAN STACK Development
//                 </option>
//                 <option value="MEVN Stack Development">
//                   MEVN STACK Development
//                 </option>
//                 <option value="Data Entry Operator">Data Entry Operator</option>
//               </select>
//             </div>
//             <div className="wrapper">
//               <input
//                 type="text"
//                 value={country}
//                 onChange={(e) => setCountry(e.target.value)}
//                 placeholder="Country"
//               />
//               <input
//                 type="text"
//                 value={city}
//                 onChange={(e) => setCity(e.target.value)}
//                 placeholder="City"
//               />
//             </div>
//             <input
//               type="text"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               placeholder="Location"
//             />
//             <div className="salary_wrapper">
//               <select
//                 value={salaryType}
//                 onChange={(e) => setSalaryType(e.target.value)}
//               >
//                 <option value="default">Select Salary Type</option>
//                 <option value="Fixed Salary">Fixed Salary</option>
//                 <option value="Ranged Salary">Ranged Salary</option>
//               </select>
//               <div>
//                 {salaryType === "default" ? (
//                   <p>Please provide Salary Type *</p>
//                 ) : salaryType === "Fixed Salary" ? (
//                   <input
//                     type="number"
//                     placeholder="Enter Fixed Salary"
//                     value={fixedSalary}
//                     onChange={(e) => setFixedSalary(e.target.value)}
//                   />
//                 ) : (
//                   <div className="ranged_salary">
//                     <input
//                       type="number"
//                       placeholder="Salary From"
//                       value={salaryFrom}
//                       onChange={(e) => setSalaryFrom(e.target.value)}
//                     />
//                     <input
//                       type="number"
//                       placeholder="Salary To"
//                       value={salaryTo}
//                       onChange={(e) => setSalaryTo(e.target.value)}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//             <textarea
//               rows="10"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Job Description"
//             />
//             <button type="submit">Create Job</button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PostJob;


import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import Navbar from "../Layout/Navbar";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  const [errors, setErrors] = useState({});

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  const validateForm = () => {
    const newErrors = {};

    if (!title) newErrors.title = "Job title is required";
    if (!category) newErrors.category = "Category is required";
    if (!country) newErrors.country = "Country is required";
    if (!city) newErrors.city = "City is required";
    if (!location) newErrors.location = "Location is required";
    if (!description) newErrors.description = "Job description is required";

    if (salaryType === "Fixed Salary") {
      if (!fixedSalary) newErrors.fixedSalary = "Fixed salary is required";
      setSalaryFrom("");
      setSalaryTo("");
    } else if (salaryType === "Ranged Salary") {
      if (!salaryFrom) newErrors.salaryFrom = "Salary from is required";
      if (!salaryTo) newErrors.salaryTo = "Salary to is required";
      setFixedSalary("");
    } else {
      newErrors.salaryType = "Please select a salary type";
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleJobPost = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const jobData =
      fixedSalary.length >= 4
        ? {
            title,
            description,
            category,
            country,
            city,
            location,
            fixedSalary,
          }
        : {
            title,
            description,
            category,
            country,
            city,
            location,
            salaryFrom,
            salaryTo,
          };

    try {
      const res = await axios.post("http://localhost:4000/api/v1/job/post", jobData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success(res.data.message);
      localStorage.setItem("jobId", res.data.job._id);
      navigateTo("/createTest");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="job_post page">
        <div className="container">
          <h3>POST NEW JOB</h3>
          <form onSubmit={handleJobPost}>
            <div className="wrapper">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Job Title"
              />
              {errors.title && <p className="error">{errors.title}</p>}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Graphics & Design">Graphics & Design</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Frontend Web Development">Frontend Web Development</option>
                <option value="MERN Stack Development">MERN STACK Development</option>
                <option value="Account & Finance">Account & Finance</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Video Animation">Video Animation</option>
                <option value="MEAN Stack Development">MEAN STACK Development</option>
                <option value="MEVN Stack Development">MEVN STACK Development</option>
                <option value="Data Entry Operator">Data Entry Operator</option>
              </select>
              {errors.category && <p className="error">{errors.category}</p>}
            </div>
            <div className="wrapper">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
              {errors.country && <p className="error">{errors.country}</p>}
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
              {errors.city && <p className="error">{errors.city}</p>}
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
            />
            {errors.location && <p className="error">{errors.location}</p>}
            <div className="salary_wrapper">
              <select
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value)}
              >
                <option value="default">Select Salary Type</option>
                <option value="Fixed Salary">Fixed Salary</option>
                <option value="Ranged Salary">Ranged Salary</option>
              </select>
              {errors.salaryType && <p className="error">{errors.salaryType}</p>}
              <div>
                {salaryType === "default" ? (
                  <p>Please provide Salary Type *</p>
                ) : salaryType === "Fixed Salary" ? (
                  <>
                    <input
                      type="number"
                      placeholder="Enter Fixed Salary"
                      value={fixedSalary}
                      onChange={(e) => setFixedSalary(e.target.value)}
                    />
                    {errors.fixedSalary && <p className="error">{errors.fixedSalary}</p>}
                  </>
                ) : (
                  <div className="ranged_salary">
                    <input
                      type="number"
                      placeholder="Salary From"
                      value={salaryFrom}
                      onChange={(e) => setSalaryFrom(e.target.value)}
                    />
                    {errors.salaryFrom && <p className="error">{errors.salaryFrom}</p>}
                    <input
                      type="number"
                      placeholder="Salary To"
                      value={salaryTo}
                      onChange={(e) => setSalaryTo(e.target.value)}
                    />
                    {errors.salaryTo && <p className="error">{errors.salaryTo}</p>}
                  </div>
                )}
              </div>
            </div>
            <textarea
              rows="10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job Description"
            />
            {errors.description && <p className="error">{errors.description}</p>}
            <button type="submit">Create Job</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostJob;
