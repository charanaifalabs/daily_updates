import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface User {
  id: string;
  username: string;
  email: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      const { user, token } = res.data;
      login({ id: user.id, username: user.username, email: user.email, token });
      navigate("/chat", { state: { username: user.username, token } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const e = error as { response?: { data?: { message?: string } } };
        alert(e.response?.data?.message || "Login failed");
      } else {
        alert("Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-100 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-emerald-600">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Sign in to continue chatting
          </p>

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
            Sign in
          </button>

          <div className="text-center mt-6 text-sm">
            <span className="text-gray-600">Don’t have an account? </span>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-emerald-600 hover:underline font-medium"
            >
              Create one
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
