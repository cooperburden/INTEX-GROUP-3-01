import React from "react";
import CreateAccountForm from "../components/CreateAccountForm";

const CreateAccount = () => {
  return (
    <div
      style={{
        backgroundColor: "#000", // 🔥 full black background
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
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
  );
};

export default CreateAccount;
