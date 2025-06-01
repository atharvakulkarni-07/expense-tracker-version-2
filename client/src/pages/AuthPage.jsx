import React, { useState } from "react";
import API from "../api/api.js"; // Adjust the path if needed
import { useNavigate } from "react-router-dom";



export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (replace with your API logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    // Basic validation
    if (!form.email || !form.password || (!isLogin && !form.username)) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }
  
    try {
      if (isLogin) {
        // LOGIN
        const res = await API.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        // set the token in the local storage;
        localStorage.setItem("token", res.data.token);

        // set the user data in the local storage;
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login successful!");
        // navigate to the dashboard now
        navigate("/dashboard");
      } else {
        // REGISTER
        const res = await API.post("/auth/register", {
          username: form.username,
          email: form.email,
          password: form.password,
        });
        alert(res.data.message || "Registration successful! Please log in.");
        setIsLogin(true);
        setForm({ username: "", email: "", password: "" });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          {isLogin ? "Sign In" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Username
              </label>
              <input
                name="username"
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.password}
              onChange={handleChange}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading
              ? isLogin
                ? "Signing In..."
                : "Registering..."
              : isLogin
              ? "Sign In"
              : "Register"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            className="ml-2 text-indigo-600 hover:underline font-medium"
            onClick={() => setIsLogin((prev) => !prev)}
            disabled={loading}
          >
            {isLogin ? "Register" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
