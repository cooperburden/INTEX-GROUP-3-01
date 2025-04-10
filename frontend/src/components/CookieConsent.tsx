import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const CookieConsent = () => {
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const { isAuthenticated } = useAuth(); // Check if user is authenticated

  // Inline styles for the consent pop-up
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    message: {
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#e50914',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      margin: '5px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  // Check if cookie consent already exists in localStorage, but only after user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const consent = localStorage.getItem('cookieConsent');
      if (consent) {
        setConsentGiven(true); // User has already accepted or rejected cookies
      }
    }
  }, [isAuthenticated]); // Only check after authentication

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true'); // Store consent
    setConsentGiven(true);
  };

  const handleDismiss = () => {
    localStorage.setItem('cookieConsent', 'false'); // Store rejection
    setConsentGiven(true); // Hide the pop-up
  };

  if (consentGiven || !isAuthenticated) return null; // Hide the consent message once accepted or rejected

  return (
    <div style={styles.container}>
      <div style={styles.message}>
        <p>
          We use cookies to improve your experience. By continuing to use our site, you agree to our use of cookies.
        </p>
        <button onClick={handleAccept} style={styles.button}>Accept</button>
        <button onClick={handleDismiss} style={styles.button}>Reject</button>
      </div>
    </div>
  );
};

export default CookieConsent;
