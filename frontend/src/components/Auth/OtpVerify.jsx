// import { Link } from "react-router-dom"
// import OtpInput from 'react-otp-input';
// import { useState } from "react";
// import toast from "react-hot-toast";
// import axios from "axios";



// const OtpVerify = () => {
//     const [otp, setOtp] = useState('');
//     // const [email, setEmail] = useState("");
// const body = {
//     'email': localStorage.getItem('email'),
//     'enteredOTP': otp
// }

//     const handleVerifyOtp = async (e) => {
//         e.preventDefault();
//         try {
//           const { data } = await axios.post(
//             "http://localhost:4000/api/v1/user/validate",
//             {  body }
//           );
//           console.log(data, 'data')
//         }
//         catch (error) {
//             toast.error(error.response.data.message);
//           }
//     }


//     return (
//         <>
//             <section className="authPage">
//                 <div className="container">
//                     <div className="header">
//                         {/* <img src="/JobZeelogo.png" alt="logo" /> */}
//                         <h2>HireSync</h2>
//                         <h3>OTP Verification</h3>
//                     </div>
//                     <form>
//                        <div className="otpInput" id="otpInput">
//                        <OtpInput
//                             value={otp}
//                             onChange={setOtp}
//                             numInputs={6}
//                             renderSeparator={<span> </span>}
//                             renderInput={(props) => <input {...props} />}
//                         />
//                        </div>
//                         <Link to={"/ChangePassword"}>Continue</Link>

//                         {/* <button type="submit" 
//                         onClick={handleVerifyOtp}
//                         >
//               Continue
//             </button> */}
//                     </form>
//                 </div>
//                 <div className="banner">
//                     <img src="/login.png" alt="login" />
//                 </div>
//             </section>

//         </>
//     )
// }

// export default OtpVerify
