import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import TitleBar from "../Components/TitleBar";
import mailIcon from "../assets/icons/mailIcon.svg";
import callIcon from "../assets/icons/callIcon.svg";
import pinIcon from "../assets/icons/pinIcon.svg";
import mapImage from "../assets/mapImage.jpg";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [supportBy, setSupportBy] = useState("admin");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData && userData.user && userData.user.id) {
      setIsLoggedIn(true);
      setUserId(userData.user.id);
      
      if (userData.user.email) {
        setEmail(userData.user.email);
      }
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login first to send a message");
      return;
    }
   
    if (!name.trim()) {
      toast.warning("Please enter your name");
      return;
    }
    if (!email.trim()) {
      toast.warning("Please enter your email");
      return;
    }
    if (!subject.trim()) {
      toast.warning("Please enter a subject");
      return;
    }
    if (!description.trim()) {
      toast.warning("Please enter your message");
      return;
    }

    setIsSubmitting(true);
    try {
      const ticketData = {
        userId: userId,
        name: name,
        subject: subject,
        email: email,
        description: description
      };
      
      await axios.post(`${backendUrl}api/user/tickets`, ticketData);
      
      toast.success("Your message has been sent successfully!");
      
      setName("");
      setSubject("");
      setDescription("");
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <TitleBar />
      
      {/* Main Container with responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-26 py-6 sm:py-8">
        {/* Responsive flex layout */}
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 xl:gap-36">
          
          {/* Location Section */}
          <div className="w-full xl:basis-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <img
                src={mapImage}
                alt="Map Image"
                className="h-40 sm:h-48 md:h-56 lg:h-48 w-full object-cover shadow-lg rounded-xl border border-slate-200"
              />
              
              <h2 className="font-roboto text-2xl sm:text-3xl mt-4 sm:mt-6 text-gray-800">
                Our Location
              </h2>
              
              <p className="font-quicksand text-base sm:text-lg text-gray-600 mt-2 sm:mt-3 leading-relaxed">
                We provide reliable and efficient logistics solutions, ensuring
                timely delivery and secure transportation of your goods worldwide.
              </p>
              
              {/* Contact Information */}
              <div className="flex flex-col gap-6 sm:gap-8 mt-6 sm:mt-8">
                <div className="flex items-start gap-4 sm:gap-6">
                  <img src={mailIcon} alt="Mail Icon" className="w-10 sm:w-12 lg:w-14 flex-shrink-0 mt-1" />
                  <div className="font-lexend text-sm sm:text-base lg:text-lg leading-relaxed font-light text-gray-700">
                    <div>info@pearllogistics.com</div>
                    <div>support@pearllogistics.com</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 sm:gap-6">
                  <img src={callIcon} alt="Call Icon" className="w-10 sm:w-12 lg:w-14 flex-shrink-0 mt-1" />
                  <div className="font-lexend text-sm sm:text-base lg:text-lg leading-relaxed font-light text-gray-700">
                    <div>+1 800-123-4567</div>
                    <div>+1 800-987-6543</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 sm:gap-6">
                  <img src={pinIcon} alt="Pin Icon" className="w-10 sm:w-12 lg:w-14 flex-shrink-0 mt-1" />
                  <div className="font-lexend text-sm sm:text-base lg:text-lg leading-relaxed font-light text-gray-700">
                    <div>1234 Freight Lane, Colombo 07,</div>
                    <div>Sri Lanka</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="w-full xl:basis-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="font-roboto text-2xl sm:text-3xl text-gray-800 mb-4">
                Contact Us
              </h3>
              
              {!isLoggedIn && (
                <div className="mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm sm:text-base">
                  Please login first to send a message
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block font-quicksand text-sm sm:text-base text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full py-3 px-4 font-lexend text-sm sm:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 border border-slate-200 transition-all duration-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isLoggedIn}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block font-quicksand text-sm sm:text-base text-gray-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full py-3 px-4 font-lexend text-sm sm:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 border border-slate-200 transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isLoggedIn}
                  />
                </div>

                {/* Support By Field */}
                <div>
                  <label className="block font-quicksand text-sm sm:text-base text-gray-700 mb-2">
                    Support By
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 font-lexend font-light bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 border border-slate-200 rounded-xl appearance-none shadow-sm cursor-pointer transition-all duration-200"
                      value={supportBy}
                      onChange={(e) => setSupportBy(e.target.value)}
                      disabled={!isLoggedIn}
                    >
                      <option value="admin">Admin</option>
                      <option value="agent">Agent</option>
                    </select>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.2"
                      stroke="currentColor"
                      className="h-5 w-5 absolute top-1/2 -translate-y-1/2 right-4 text-slate-700 pointer-events-none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                      />
                    </svg>
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block font-quicksand text-sm sm:text-base text-gray-700 mb-2">
                    Message Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your subject"
                    className="w-full py-3 px-4 font-lexend text-sm sm:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 border border-slate-200 transition-all duration-200"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={!isLoggedIn}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block font-quicksand text-sm sm:text-base text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    placeholder="Enter your message"
                    rows={5}
                    className="w-full resize-none py-3 px-4 font-lexend text-sm sm:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 border border-slate-200 transition-all duration-200"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!isLoggedIn}
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className={`font-lexend w-full py-3 sm:py-4 text-lg sm:text-xl rounded-full mt-6 transition-all duration-200 ${
                    isLoggedIn 
                      ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!isLoggedIn || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Sending...
                    </span>
                  ) : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;