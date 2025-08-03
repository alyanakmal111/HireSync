import { useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";
import Navbar from "../Layout/Navbar";

const Home = () => {
  const { isAuthorized } = useContext(Context);
  if (!isAuthorized) {
    console.log("You are not authorized to");
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <section className="homePage page">
      <Navbar />
        <HeroSection />
        <HowItWorks />
        <PopularCategories />
        <PopularCompanies />
      </section>
    </>
  );
};

export default Home;
