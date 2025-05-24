import React from "react";
import TitleBar from "../Components/TitleBar";
import loginIcon from "../assets/icons/loginIcon.svg";
import productsIcon from "../assets/icons/productsIcon.png";
import requestProductsIcon from "../assets/icons/requestProductsIcon.png";
import supportIcon from "../assets/icons/supportIcon.png";
import arrowRightIcon from "../assets/icons/arrowRightIcon.svg";
import { FloatingNav } from "../Components/FloatingNav";

const Home = () => {
  return (
    <>
      <FloatingNav/>
      <div className="min-h-screen flex flex-col bg-[url('./assets/HeroBG.jpg')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <TitleBar />
        <div className="flex flex-col lg:flex-row items-center justify-between flex-1 z-10 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-6 sm:py-8 md:py-12 gap-8 lg:gap-4">
          <div className="flex flex-col items-center lg:items-start gap-6 sm:gap-8 lg:gap-10 w-full lg:w-auto text-center lg:text-left">
            <div className="uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold font-roboto leading-tight">
              <h1>Power Beyond</h1>
              <h1>Cargo</h1>
            </div>
            <button className="flex items-center cursor-pointer hover:scale-95 duration-100 gap-2 border-white border-2 rounded-lg px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 w-fit">
              <span className="text-lg sm:text-xl md:text-2xl text-white font-lexend">Get Started</span>
              <img src={loginIcon} alt="Login Icon" className="w-8 sm:w-10 md:w-12" />
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full lg:w-auto max-w-2xl">
            <div className="bg-blue-100 py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center rounded-xl sm:rounded-2xl gap-4 sm:gap-0">
              <img src={productsIcon} alt="Products Icon" className="w-12 sm:w-14 md:w-16 lg:w-18 flex-shrink-0" />
              <div className="flex flex-col gap-1 sm:gap-2 px-0 sm:px-4 md:px-6 text-center sm:text-left flex-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-roboto">Our Products</h3>
                <span className="text-sm sm:text-base md:text-lg leading-tight text-gray-600 font-quicksand">
                  We have listed products from all over the world. Shop anytime and place an order.
                </span>
              </div>
              <img src={arrowRightIcon} alt="Arrow Right Icon" className="w-6 sm:w-7 md:w-8 flex-shrink-0 hidden sm:block" />
            </div>
            <div className="bg-blue-100 py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center rounded-xl sm:rounded-2xl gap-4 sm:gap-0">
              <img src={requestProductsIcon} alt="RequestProducts Icon" className="w-12 sm:w-14 md:w-16 lg:w-18 flex-shrink-0" />
              <div className="flex flex-col gap-1 sm:gap-2 px-0 sm:px-4 md:px-6 text-center sm:text-left flex-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-roboto">Request Product</h3>
                <span className="text-sm sm:text-base md:text-lg leading-tight text-gray-600 font-quicksand">
                  We have agents all over the world. Tell us about the product you want to receive from any country.
                </span>
              </div>
              <img src={arrowRightIcon} alt="Arrow Right Icon" className="w-6 sm:w-7 md:w-8 flex-shrink-0 hidden sm:block" />
            </div>
            <div className="bg-blue-100 py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center rounded-xl sm:rounded-2xl gap-4 sm:gap-0">
              <img src={supportIcon} alt="Support Icon" className="w-12 sm:w-14 md:w-16 lg:w-18 flex-shrink-0" />
              <div className="flex flex-col gap-1 sm:gap-2 px-0 sm:px-4 md:px-6 text-center sm:text-left flex-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-roboto">Contact Us</h3>
                <span className="text-sm sm:text-base md:text-lg leading-tight text-gray-600 font-quicksand">
                  Don't hold back if you have any concerns. Just raise a ticket, and we will get back to you.
                </span>
              </div>
              <img src={arrowRightIcon} alt="Arrow Right Icon" className="w-6 sm:w-7 md:w-8 flex-shrink-0 hidden sm:block" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;