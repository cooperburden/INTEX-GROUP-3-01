import React from "react";
import "../styles/Header.scss";

function Header() {
  return (
    <>
      <header className="header">
        {/* Logo on the left */}
        <img
          src="../../public/logo.png"
          alt="Company Logo"
          style={{ width: "125px", height: "125px" }}
          className="logo"
        />

        <div className="wrapper-right">
          <div>
            <input
              type="input"
              className="form__field"
              placeholder="Search"
              name="search"
              id="search"
              required
            />
            <label htmlFor="search" className="form__label">
              Search
            </label>
          </div>

          {/* User Icon on the right */}
          <div className="dropdown">
            <img
              src="../../public/user-icon-white.svg"
              alt="User Icon"
              style={{ width: "50px", height: "60px" }}
            />
            {/* Triangle trigger for dropdown */}
            <img
              src="../../public/trianglewhite.svg"
              alt="Dropdown Arrow"
              className="dropdown-icon"
              style={{ width: "15px", height: "15px" }}
            />

            {/* Dropdown menu */}
            <div className="dropdown-menu">
              <ul>
                <li>Profile</li>
                <li>Settings</li>
                <li>Logout</li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
