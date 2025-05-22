import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainLogo from "../assets/MainLogo.png";
import ShoppingCart from "./ShoppingCart";

const TitleBar = ({ cart }) => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate("/");
  };
  
  const handleConnectClick = () => {
        
   navigate("/signup");
    
  };
  
  return (
    <div className="pb-2 bg-[#FFAB00]/40 rounded-b-4xl z-20">
      <div className="pb-2 bg-[#FFAB00]/60 rounded-b-4xl">
        <div className="flex items-center justify-between bg-[#FFAB00] px-12 py-4 rounded-b-4xl">
          <div className="flex items-center gap-6">
            <img 
              src={MainLogo} 
              alt="Main Logo" 
              className="w-16 cursor-pointer" 
              onClick={handleLogoClick}
            />
            <div className="uppercase text-3xl font-extrabolds text-blue-900 font-roboto cursor-pointer">
              <h1 onClick={handleLogoClick}>Pearl Logistics</h1>
              <h1 onClick={handleLogoClick}>PVT LTD</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={handleConnectClick}
              className="bg-blue-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-800 transition duration-300 shadow-md"
            >
              Connect with us
            </button>
            
            <div className="flex-shrink-0">
              <ShoppingCart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;