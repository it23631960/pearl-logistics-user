import React from "react";
import TitleBar from "../Components/TitleBar";
import loginIcon from "../assets/icons/loginIcon.svg";
import productsIcon from "../assets/icons/productsIcon.png";
import requestProductsIcon from "../assets/icons/requestProductsIcon.png";
import supportIcon from "../assets/icons/supportIcon.png";
import arrowRightIcon from "../assets/icons/arrowRightIcon.svg";
import { FloatingNav } from "../Components/FloatingNav";

const Home = () => {
  return (<>
  <FloatingNav/>
    <div className="h-screen flex flex-col bg-[url('./assets/HeroBG.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
      <TitleBar />
      <div className="flex items-center justify-between flex-1 z-10 px-24 py-12">
        <div className="flex flex-col items-start gap-10">
          <div className="uppercase text-6xl text-white font-bold font-roboto">
            <h1>Power Beyond</h1>
            <h1>Cargo</h1>
          </div>
          <button className="flex items-center cursor-pointer hover:scale-95 duration-100 gap-2 border-white border-2 rounded-lg px-6 py-2">
            <span className="text-2xl text-white font-lexend">Get Started</span>
            <img src={loginIcon} alt="Login Icon" className="w-12" />
          </button>
        </div>
        <div className="flex flex-col gap-10">
          <div className="bg-blue-100 py-6 px-12 flex items-center rounded-2xl">
            <img src={productsIcon} alt="Products Icon" className="w-18" />
            <div className="flex flex-col gap-2 w-lg px-6">
              <h3 className="text-2xl font-roboto">Our Products</h3>
              <span className="text-lg leading-tight text-gray-600 font-quicksand">
                We have listed products from all over the world. Shop anytime
                and place an order.
              </span>
            </div>
            <img src={arrowRightIcon} alt="Arrow Right Icon" className="w-8" />
          </div>
          <div className="bg-blue-100 py-6 px-12 flex items-center rounded-2xl">
            <img
              src={requestProductsIcon}
              alt="RequestProducts Icon"
              className="w-18"
            />
            <div className="flex flex-col gap-2 w-lg px-6">
              <h3 className="text-2xl font-roboto">Request Product</h3>
              <span className="text-lg leading-tight text-gray-600 font-quicksand">
                We have agents all over the world. Tell us about the product you
                want to receive from any country.
              </span>
            </div>
            <img src={arrowRightIcon} alt="Arrow Right Icon" className="w-8" />
          </div>
          <div className="bg-blue-100 py-6 px-12 flex items-center rounded-2xl">
            <img src={supportIcon} alt="Support Icon" className="w-18" />
            <div className="flex flex-col gap-2 w-lg px-6">
              <h3 className="text-2xl font-roboto">Contact Us</h3>
              <span className="text-lg leading-tight text-gray-600 font-quicksand">
                Don’t hold back if you have any concerns. Just raise a ticket,
                and we will get back to you.
              </span>
            </div>
            <img src={arrowRightIcon} alt="Arrow Right Icon" className="w-8" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
