// components/LoginForm.tsx
import React, { useState } from "react";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "", // even if you’re not checking it yet, good placeholder
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 TODO: Add actual auth logic
    console.log("🔐 Logging in with:", credentials);
    alert("Login attempted!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        fontSize: "1.1rem",
      }}
    >
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={credentials.email}
        onChange={handleChange}
        required
        style={{ padding: "1rem", fontSize: "1rem", borderRadius: "5px" }}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
        required
        style={{ padding: "1rem", fontSize: "1rem", borderRadius: "5px" }}
      />

      <button
        type="submit"
        style={{
          padding: "1rem",
          backgroundColor: "#e50914",
          color: "white",
          border: "none",
          borderRadius: "0.25rem",
          fontWeight: "600",
          fontSize: "1.1rem",
          cursor: "pointer",
        }}
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
