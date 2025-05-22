import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;



export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    
    try {
      const response = await axios.post(`${backendUrl}api/auth/login`, {
        email,
        password,
      });

      const { success, message, token, user } = response.data;

      if (success) {
        sessionStorage.setItem("userData", JSON.stringify({ token, user }));
        toast.success(message || "Login successful");
        navigate("/");
      } else {
        toast.error(message || "Login failed. Try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/logback.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative bg-[#2C2C2C] p-8 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-white text-lg mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-2 rounded border border-gray-500 bg-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-2 rounded border border-gray-500 bg-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="text-gray-400 text-sm mb-4">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-yellow-500 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up here
          </a>
        </p>

        <button
          className={`w-full py-2 rounded font-semibold ${
            email && password ? "bg-[#FFBB00] hover:bg-yellow-600" : "bg-gray-500 cursor-not-allowed"
          }`}
          onClick={handleLogin}
          disabled={!email || !password || loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </div>
    </div>
  );
}
