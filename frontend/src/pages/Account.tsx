import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

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
    fetch("https://intexwebapp301-fyaqd3dxdjakcmc5.eastus-01.azurewebsites.net/api/Users/me", {
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
    <>
      <Header />
      <div className="container" style={{ paddingTop: "7rem", paddingBottom: "3rem" }}>
        {/* Back Button aligned to the left */}
        <div className="row mb-4">
          <div className="col-12 text-start"> {/* Aligns button to the left */}
            <button
              onClick={() => navigate("/movieList")}
              className="btn btn-danger btn-lg"
            >
              ← Back to Movie List
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="row">
          <div className="col-12 col-md-8 offset-md-2">
            <div className="card p-4 shadow-sm">
              <h2 className="text-center mb-4">Your Account</h2>
              <div className="mb-3">
                <strong>ID:</strong> {profile.userId}
              </div>
              <div className="mb-3">
                <strong>Name:</strong> {profile.name}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {profile.email}
              </div>
              <div className="mb-3">
                <strong>Phone:</strong> {profile.phone}
              </div>
              <div className="mb-3">
                <strong>Age:</strong> {profile.age}
              </div>
              <div className="mb-3">
                <strong>Gender:</strong> {profile.gender}
              </div>
              <div className="mb-3">
                <strong>City:</strong> {profile.city}
              </div>
              <div className="mb-3">
                <strong>State:</strong> {profile.state}
              </div>
              <div className="mb-3">
                <strong>ZIP:</strong> {profile.zip}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;
