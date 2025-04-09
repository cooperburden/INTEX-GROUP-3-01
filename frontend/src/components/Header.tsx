import React from "react";
import "../styles/Header.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Header() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="header">
        {/* Logo on the left */}
        <img
          src="/logo.png"
          alt="Company Logo"
          style={{ width: "100px", height: "100px" }}
          className="logo"
        />

        <div className="wrapper-right">
          <div>
            {/* <input
              type="input"
              className="form__field"
              placeholder="Search"
              name="search"
              id="search"
              required
            />
            <label htmlFor="search" className="form__label">
              Search
            </label> */}
            <button className="magnify-button"></button>
          </div>

          {/* User Icon and dropdown menu (only when logged in) */}
          {isAuthenticated && (
            <div className="dropdown">
              <img
                src="/user-icon-white.svg"
                alt="User Icon"
                style={{ width: "50px", height: "60px" }}
              />
              <img
                src="/trianglewhite.svg"
                alt="Dropdown Arrow"
                className="dropdown-icon"
                style={{ width: "15px", height: "15px" }}
              />

              <div className="dropdown-menu">
                <ul>
                  <li>Profile</li>
                  <li>Settings</li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
