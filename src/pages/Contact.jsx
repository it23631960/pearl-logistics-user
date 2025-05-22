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
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <TitleBar />
      <div className="flex py-8 px-26 gap-36">
        <div className="basis-1/2">
          <img
            src={mapImage}
            alt="Map Image"
            className="h-48 w-full object-cover shadow-lg rounded-xl border-1 border-slate-200"
          />
          <h2 className="font-roboto text-3xl mt-4">Our Location</h2>
          <p className="font-quicksand text-lg text-gray-500 mt-2">
            We provide reliable and efficient logistics solutions, ensuring
            timely delivery and secure transportation of your goods worldwide.
          </p>
          <div className="flex flex-col gap-8 mt-8">
            <div className="flex items-center gap-6">
              <img src={mailIcon} alt="Mail Icon" className="w-14" />
              <div className="font-lexend text-lg leading-snug font-light">
                info@pearllogistics.com
                <br />
                support@pearllogistics.com
              </div>
            </div>
            <div className="flex items-center gap-6">
              <img src={callIcon} alt="Call Icon" className="w-14" />
              <div className="font-lexend text-lg leading-snug font-light">
                +1 800-123-4567
                <br />
                +1 800-987-6543
              </div>
            </div>
            <div className="flex items-center gap-6">
              <img src={pinIcon} alt="Pin Icon" className="w-14" />
              <div className="font-lexend text-lg leading-snug font-light">
                <span>
                  1234 Freight Lane, Colombo 07,
                  <br />
                  Sri Lanka
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-1/2">
          <h3 className="font-roboto text-3xl">Contact Us</h3>
          {!isLoggedIn && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
              Please login first to send a message
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <span className="font-quicksand">Your Name</span>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full mt-1 py-2 px-4 font-lexend text-sm rounded-xl focus:outline-none border border-slate-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isLoggedIn}
              />
            </div>
            <div className="mt-4">
              <span className="font-quicksand">Your Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 py-2 px-4 font-lexend text-sm rounded-xl focus:outline-none border border-slate-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isLoggedIn}
              />
            </div>
            <div className="mt-4">
              <span className="font-quicksand">Support By</span>
              <div className="w-full relative mt-2">
                <select 
                  className="w-full px-4 font-lexend font-light bg-transparent text-sm focus:outline-none border border-slate-200 rounded-xl py-2 appearance-none shadow-sm cursor-pointer"
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
                  className="h-5 w-5 absolute top-1/2 -translate-y-1/2 right-4 text-slate-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="font-quicksand">Message Subject</span>
              <input
                type="text"
                placeholder="Enter your subject"
                className="w-full mt-1 py-2 px-4 font-lexend text-sm rounded-xl focus:outline-none border border-slate-200"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={!isLoggedIn}
              />
            </div>
            <div className="mt-4">
              <span className="font-quicksand">Your Message</span>
              <textarea
                placeholder="Enter your message"
                rows={6}
                className="w-full mt-1 resize-none py-2 px-4 font-lexend text-sm rounded-xl focus:outline-none border border-slate-200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isLoggedIn}
              />
            </div>
            <button 
              type="submit"
              className={`font-lexend w-full py-4 text-xl rounded-full mt-4 ${
                isLoggedIn 
                  ? "hover:bg-blue-500 cursor-pointer bg-blue-300" 
                  : "bg-gray-300 cursor-not-allowed"
              } duration-100`}
              disabled={!isLoggedIn || isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;