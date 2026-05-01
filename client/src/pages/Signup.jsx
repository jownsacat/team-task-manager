import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (res.data && res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        navigate("/projects");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;