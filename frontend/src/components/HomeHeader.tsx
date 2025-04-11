import "../styles/Header.scss";
import { useNavigate } from "react-router-dom";

function Header() {

  const navigate = useNavigate();


  return (
    <>
      <header className="header">
        {/* Logo on the left */}
        <div className="logo-container">
          <img
            src="/logo.png"
            alt="Company Logo"
            style={{ width: "100px", height: "100px" }}
            className="logo"
          />
          <h1 className="logo-title">CineNiche</h1>
        </div>

        <div className="wrapper-right">

          {/* User Icon on the right */}
          <div className="dropdown" style={{ position: "relative", display: "inline-block" }}>
  <img
    src="../public/user-icon-white.svg"
    alt="User Icon"
    style={{ width: "50px", height: "60px" }}
  />


  {/* Hover Dropdown Menu */}
  <div className="dropdown-menu">
    <ul>
    <li onClick={() => navigate("/login")}>Login</li> {/* 👈 Navigate to login */}
    </ul>
  </div>

  {/* 👇 Tooltip under icon */}
  <div
    style={{
      position: "absolute",
      top: "70px", // slightly below the user icon
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "0.75rem",
      color: "white",
      textAlign: "center",
      whiteSpace: "nowrap",
    }}
  >
    ↑<br />
    Have an account? Login here
  </div>
</div>

        </div>
      </header>
    </>
  );
}

export default Header;
