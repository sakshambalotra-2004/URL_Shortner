import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // -------- LOGIN --------
      if (isLogin) {
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email: form.email,
            password: form.password,
          }
        );

        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }

      // -------- SIGNUP WITH OTP --------
      else {
        // STEP 1: SEND OTP
        if (!otpSent) {
          await axios.post(
            "http://localhost:5000/api/auth/signup",
            form
          );

          setOtpSent(true);
          alert("OTP sent to your email");
        }
        // STEP 2: VERIFY OTP
        else {
          await axios.post(
            "http://localhost:5000/api/auth/verify-otp",
            {
              email: form.email,
              otp: otp,
            }
          );

          alert("Signup successful! Please login.");
          setIsLogin(true);
          setOtpSent(false);
          setOtp("");
          setForm({ name: "", email: "", password: "" });
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          {!isLogin && !otpSent && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          )}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={otpSent}
            className="w-full p-2 border rounded"
          />

          {/* PASSWORD */}
          {(isLogin || (!isLogin && !otpSent)) && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          )}


          {/* OTP */}
          {!isLogin && otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isLogin
              ? "Login"
              : otpSent
              ? "Verify OTP"
              : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setOtpSent(false);
              setOtp("");
            }}
            className="text-blue-600 ml-1 hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
