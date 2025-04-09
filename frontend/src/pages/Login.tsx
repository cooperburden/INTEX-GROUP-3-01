// pages/Login.tsx
import React from "react";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#333",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        ← Back to Home
      </button>

      {/* Login Form Container */}
      <div
        style={{
          padding: "4rem 2rem",
          maxWidth: "600px",
          margin: "0 auto",
          color: "white",
        }}
      >
        <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
          Welcome Back
        </h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
