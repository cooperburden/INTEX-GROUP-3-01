import "../styles/Header.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Header() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Your existing logout logic (make sure to call logout from your context)
    logout();
  
    // Clear the cookie consent from localStorage to show the notification again when they log back in
    localStorage.removeItem('cookieConsent'); 
  
    // Navigate to the home page or wherever you want after logging out
    navigate("/");
  };

  // Navigate to movie list page
  const goToMovieList = () => {
    navigate("/movieList");
  };

  // Navigate to search page
  const goToSearch = () => {
    navigate("/search");
  };

  // Navigate to account page
  const goToAccount = () => {
    navigate("/account");
  };

  // Navigate to admin page
  const goToAdmin = () => {
    navigate("/admin");
  };

  return (
    <>
      <header className="header">
        {/* Logo and Title (clickable) */}
        <div className="logo-container" onClick={goToMovieList} style={{ cursor: "pointer" }}>
          <img
            src="/logo.png"
            alt="Company Logo"
            style={{ width: "100px", height: "100px" }}
            className="logo"
          />
          <h1 className="logo-title">CineNiche</h1>
        </div>

        <div className="wrapper-right">
          <div>
            {/* Search Button */}
            <button className="magnify-button" onClick={goToSearch} style={{ cursor: "pointer" }}>
              {/* Optionally, you can add an icon or text to indicate search here */}
            </button>
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
                  <li onClick={goToAccount}>Account</li>
                  <li onClick={goToAdmin}>Admin</li>
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
