import { useNavigate } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const handlePrivacyClick = () => {
    navigate('/privacy');
  };

  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} CineNiche |{' '}
        <span className="privacy-link" onClick={handlePrivacyClick}>
          Privacy Policy
        </span>
      </p>
    </footer>
  );
};

export default Footer;
