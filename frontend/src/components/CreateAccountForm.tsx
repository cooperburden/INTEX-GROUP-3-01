import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const inputStyle = {
  padding: "1rem",
  fontSize: "1.1rem",
  borderRadius: "0.25rem",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  color: "#000",
};

const CreateAccountForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    city: "",
    state: "",
    zip: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Register with Identity
      const registerResponse = await fetch("https://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!registerResponse.ok) {
        alert("❌ Account creation failed. Please try a different email.");
        setLoading(false);
        return;
      }

      console.log("✅ Identity user registered");

      // Step 2: Add profile to movies_users
      const profileResponse = await fetch("https://localhost:5000/api/Users/AddUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          zip: parseInt(formData.zip),
          Netflix: 0,
          "Amazon Prime": 0,
          "Disney+": 0,
          "Paramount+": 0,
          Max: 0,
          Hulu: 0,
          "Apple TV+": 0,
          Peacock: 0,
        }),
      });

      if (profileResponse.ok) {
        alert("✅ Account created successfully. Please log in.");
        navigate("/");
      } else {
        alert("⚠️ Identity created, but failed to save profile.");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
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
      <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required style={inputStyle} />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={inputStyle} />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={inputStyle} />
      <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required style={inputStyle} />
      <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required style={inputStyle} />
      <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required style={inputStyle} />

      <select name="state" value={formData.state} onChange={handleChange} required style={inputStyle}>
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <input type="number" name="zip" placeholder="ZIP Code" value={formData.zip} onChange={handleChange} required style={inputStyle} />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "1rem",
          backgroundColor: loading ? "#555" : "#e50914",
          color: "white",
          border: "none",
          borderRadius: "0.25rem",
          fontWeight: "600",
          fontSize: "1.1rem",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s",
        }}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default CreateAccountForm;
