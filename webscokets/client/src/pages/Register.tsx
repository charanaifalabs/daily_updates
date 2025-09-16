import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: RegisterRequest = { username, email, password };
      await API.post("/auth/register", payload);
      alert("Registered — please login.");
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const e = error as { response?: { data?: { message?: string } } };
        alert(e.response?.data?.message || "Registration failed");
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-emerald-600">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Join now to start chatting
          </p>

          <label className="block mb-2 text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-4"
            required
          />

          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-4"
            required
          />

          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-6"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Register
          </button>

          <div className="text-center mt-6 text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-emerald-600 hover:underline font-medium"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
