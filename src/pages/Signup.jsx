import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Signup() {
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
     email: "",
     password: "",
     contactNo: "",
   });
   
   const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };
   
   const handleSubmit = async (e) => {
     e.preventDefault(); 
     if (!formData.email || !formData.password || !formData.contactNo) {
       toast.error("Please fill in all fields");
       return;
     }

     try {
       console.log("Registering user:", formData);
       
       const response = await axios.post(`${backendUrl}api/auth/register`, formData, {
         headers: {
           'Content-Type': 'application/json'
         }
       });
       
       console.log("Registration response:", response.data);
       if (response.data.success) {
         toast.success(response.data.message || "Registration successful");
         navigate("/login");
       } else {
         toast.error(response.data.message || "Registration failed");
       }
     } catch (error) {
       console.error("Registration error:", error);
       
      
       if (error.response) {
         
         toast.error(error.response.data.message || "Registration failed");
       } else if (error.request) {
         
         toast.error("No response from server. Please check your connection.");
       } else {
         
         toast.error("Error setting up registration request");
       }
     }
   };

   return (
     <div 
       className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
       style={{ backgroundImage: "url('/images/logback.jpg')" }}
     >
       <div className="absolute inset-0 bg-black opacity-40"></div>
       <div className="relative bg-[#2C2C2C] p-8 rounded-lg shadow-lg w-80 text-center">
         <h2 className="text-white text-lg mb-4">Sign up</h2>
         <form onSubmit={handleSubmit}>
           <input
             type="email"
             name="email"
             placeholder="Email"
             value={formData.email}
             onChange={handleChange}
             required
             className="w-full px-4 py-2 mb-2 rounded border border-gray-500 bg-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
           />
           <input
             type="password"
             name="password"
             placeholder="Password"
             value={formData.password}
             onChange={handleChange}
             required
             className="w-full px-4 py-2 mb-2 rounded border border-gray-500 bg-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
           />
           <input
             type="text"
             name="contactNo"
             placeholder="Mobile Number"
             value={formData.contactNo}
             onChange={handleChange}
             required
             className="w-full px-4 py-2 mb-2 rounded border border-gray-500 bg-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
           />
           <p className="text-gray-400 text-sm mb-4">
             Do you have an account?{" "}
             <a
               href="#"
               className="text-yellow-500 cursor-pointer"
               onClick={() => navigate("/login")}
             >
               Login here
             </a>
           </p>
           <button
             type="submit"
             className="w-full bg-[#FFBB00] text-black py-2 rounded font-semibold hover:bg-yellow-600"
           >
             Sign Up
           </button>
         </form>
       </div>
     </div>
   );
}