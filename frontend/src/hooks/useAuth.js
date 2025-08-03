import { Navigate, useNavigate } from "react-router-dom";
import AuthAPIs from "../libs/apis/auth.api"
import { Context } from "../main";
import { useContext } from "react";
import toast from "react-hot-toast";

const useAuth = () => {
    const { isAuthorized, setIsAuthorized } = useContext(Context);
    const navigate = useNavigate()
    const login = async (body) => {
        const response = await AuthAPIs.login(body);
        console.log(response);
        const { data } = response;
        console.log(data, 'data of the response');
        if (data.user.isVerified === false) {
            navigate('/OtpVerify');
        }
        localStorage.setItem("token",data.token),
        toast.success(data.message);

        setIsAuthorized(true);
        if (isAuthorized) {
            navigate('/');
        }
    }
    return {
        login
    }
}
export default useAuth;