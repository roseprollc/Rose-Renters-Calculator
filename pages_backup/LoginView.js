import React, { useContext, useState } from "react";
import { AuthContext } from "../src/context/AuthContext";
import { ThemeContext } from "../src/context/ThemeContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const LoginView = () => {
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fakeToken = `mock.jwt.token.${Date.now()}`;
    login(fakeToken);
    toast.success("✅ Logged in!");
    router.push("/renters");
  };

  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? "bg-black text-white" : "bg-white text-black"} min-h-screen flex items-center justify-center font-techno px-4`}>
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md p-8 rounded-xl shadow-xl ${isDark ? "bg-[#1a1a1a] border border-[#00ff88]" : "bg-gray-100 border border-gray-300"}`}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-[#00ff88]">🚀 Login to RoseIntel</h1>

        <label className="block mb-2 text-sm font-semibold">Email</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 mb-4 rounded-md border ${isDark ? "bg-black text-white border-[#00ff88]" : "bg-white border-gray-300 text-black"}`}
        />

        <label className="block mb-2 text-sm font-semibold">Password</label>
        <input
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 mb-6 rounded-md border ${isDark ? "bg-black text-white border-[#00ff88]" : "bg-white border-gray-300 text-black"}`}
        />

        <button
          type="submit"
          className="w-full py-2 font-bold rounded-md bg-[#00ff88] text-black hover:brightness-110 transition"
        >
          Login
        </button>

        <p className={`mt-4 text-sm text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Don’t have an account? <a href="/signup" className="underline text-[#00ff88]">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginView;
