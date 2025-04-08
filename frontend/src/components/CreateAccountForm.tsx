import React, { useState } from "react";

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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
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
    console.log("Form submitted:", formData);

    try {
      const response = await fetch("https://localhost:5000/api/Users/AddUser", {
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

      if (response.ok) {
        const user = await response.json();
        console.log("✅ User created:", user);
        alert("Account successfully created!");
      } else {
        console.error("❌ Failed to create user");
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Network error. Please try again.");
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
        style={{
          padding: "1rem",
          backgroundColor: "#e50914",
          color: "white",
          border: "none",
          borderRadius: "0.25rem",
          fontWeight: "600",
          fontSize: "1.1rem",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f40612")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e50914")}
      >
        Create Account
      </button>
    </form>
  );
};

export default CreateAccountForm;
