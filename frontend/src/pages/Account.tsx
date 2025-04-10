import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  userId: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  zip: number;
}

const Account = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:5000/api/Users/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading your profile...</p>;
  if (!profile) return <p>Not authorized to view this page.</p>;

  return (
    <div style={{ padding: "2rem", color: "#fff", backgroundColor: "#111", minHeight: "100vh" }}>
      <button
  onClick={() => navigate("/movieList")}
  style={{
    marginBottom: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }}
>
  ← Back to Movie List
</button>

      
      <h2>Your Account</h2>
      <p><strong>ID:</strong> {profile.userId}</p>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>Age:</strong> {profile.age}</p>
      <p><strong>Gender:</strong> {profile.gender}</p>
      <p><strong>City:</strong> {profile.city}</p>
      <p><strong>State:</strong> {profile.state}</p>
      <p><strong>ZIP:</strong> {profile.zip}</p>
    </div>
  );
};

export default Account;
