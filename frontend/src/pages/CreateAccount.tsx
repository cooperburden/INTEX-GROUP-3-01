// import React from 'react';
import CreateAccountForm from "../components/CreateAccountForm";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const CreateAccount = () => {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          backgroundColor: "#000", // Full black background
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>

        <div
          style={{
            padding: "4rem 2rem",
            maxWidth: "600px",
            width: "100%",
            margin: "0 auto",
            color: "white",
            position: "relative",
            zIndex: 10,
          }}
        >
          <h2
            style={{
              marginBottom: "2rem",
              textAlign: "center",
              color: "white",
              fontSize: "2rem",
            }}
          >
            Create Your Account
          </h2>

          <CreateAccountForm />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateAccount;
