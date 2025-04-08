import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/MovieList.css";

const Privacy = () => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    // Get the height of the header element after it has rendered
    const header = document.querySelector(".header") as HTMLElement; // Type assertion to HTMLElement
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 20 }}>
        <Header /> {/* Sticky header */}
      </div>

      {/* Adjust marginTop dynamically based on headerHeight */}
      <div style={{ marginTop: `${headerHeight}px`, padding: "20px" }}>
        <h1 style={{ textAlign: "center" }}>Privacy Policy for CineNiche</h1> {/* Centering the title */}
        <p style={{ textAlign: "left" }}><strong>Last updated:</strong> 08 April 2025</p>

        <p style={{ textAlign: "left" }}>
          CineNiche ("we," "us," or "our") is committed to protecting and respecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data
          when you access or use our streaming services ("Service"). This Privacy Policy applies to all
          users of our website and services.
        </p>

        <h2 style={{ textAlign: "left" }}>1. Data Controller</h2>
        <p style={{ textAlign: "left" }}>The data controller responsible for the processing of your personal data is CineNiche.</p>

        <h2 style={{ textAlign: "left" }}>2. Personal Data We Collect</h2>
        <p style={{ textAlign: "left" }}>
          We collect the following types of personal data when you use our Service:
          <ul>
            <li><strong>Account Information</strong>: Name, email address, password, payment details, subscription information.</li>
            <li><strong>Usage Data</strong>: Information about your interactions with our website and content, including IP address, browser type, device type, location data, and viewing history.</li>
            <li><strong>Communication Data</strong>: Messages and communications with our support team.</li>
          </ul>
        </p>

        <h2 style={{ textAlign: "left" }}>3. How We Use Your Personal Data</h2>
        <p style={{ textAlign: "left" }}>
          We process your personal data for the following purposes:
          <ul>
            <li><strong>Provide and Improve Services</strong>: To offer personalized recommendations, stream content, and enhance the user experience.</li>
            <li><strong>Account Management</strong>: To manage your subscription, process payments, and handle account-related queries.</li>
            <li><strong>Customer Support</strong>: To respond to your inquiries and provide customer service.</li>
            <li><strong>Legal Compliance</strong>: To comply with legal obligations and protect our rights.</li>
            <li><strong>Marketing</strong>: To send promotional emails or notifications (if you have opted in).</li>
          </ul>
        </p>

        <h2 style={{ textAlign: "left" }}>4. Lawful Basis for Processing</h2>
        <p style={{ textAlign: "left" }}>
          We process your personal data based on the following lawful bases:
          <ul>
            <li><strong>Contractual Necessity</strong>: To perform our contract with you, including providing access to our services and handling payments.</li>
            <li><strong>Legitimate Interests</strong>: For improving our services, preventing fraud, and maintaining security.</li>
            <li><strong>Consent</strong>: For marketing communications, where you have explicitly opted in.</li>
            <li><strong>Legal Obligation</strong>: To comply with legal requirements, including tax and accounting obligations.</li>
          </ul>
        </p>

        <h2 style={{ textAlign: "left" }}>5. Sharing Your Personal Data</h2>
        <p style={{ textAlign: "left" }}>
          We may share your personal data with third parties in the following situations:
          <ul>
            <li><strong>Service Providers</strong>: We may engage third-party providers to help with payment processing, email communication, analytics, and other services.</li>
            <li><strong>Legal Requirements</strong>: If required by law, we may share your data with government authorities or in response to legal processes.</li>
            <li><strong>Business Transfers</strong>: In the event of a merger, acquisition, or sale of assets, your personal data may be transferred.</li>
          </ul>
        </p>

        <h2 style={{ textAlign: "left" }}>6. Data Retention</h2>
        <p style={{ textAlign: "left" }}>
          We will retain your personal data for as long as necessary to fulfill the purposes outlined in this Privacy Policy, or as required by law.
          This includes retaining data to comply with legal obligations, resolve disputes, and enforce agreements.
        </p>

        <h2 style={{ textAlign: "left" }}>7. Your Rights</h2>
        <p style={{ textAlign: "left" }}>
          In the United States, you may have the following rights regarding your personal data, depending on your state:
          <ul>
            <li><strong>Right to Access</strong>: You can request a copy of the personal data we hold about you.</li>
            <li><strong>Right to Rectification</strong>: You can request corrections to inaccurate or incomplete data.</li>
            <li><strong>Right to Erasure</strong>: You can request the deletion of your personal data under certain conditions.</li>
            <li><strong>Right to Restriction of Processing</strong>: You can request to limit how we process your data.</li>
            <li><strong>Right to Object</strong>: You can object to certain types of processing, including direct marketing.</li>
            <li><strong>Right to Data Portability</strong>: You can request your data in a structured, commonly used, and machine-readable format.</li>
          </ul>
          To exercise any of these rights, please contact us through our website.
        </p>

        <h2 style={{ textAlign: "left" }}>8. Security of Your Data</h2>
        <p style={{ textAlign: "left" }}>
          We take appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or alteration.
          However, no system is completely secure, and we cannot guarantee the absolute security of your data.
        </p>

        <h2 style={{ textAlign: "left" }}>9. Cookies and Tracking Technologies</h2>
        <p style={{ textAlign: "left" }}>
          We use cookies and similar technologies to enhance your experience and analyze usage patterns. You can manage your cookie preferences through your browser settings.
        </p>

        <h2 style={{ textAlign: "left" }}>10. International Transfers</h2>
        <p style={{ textAlign: "left" }}>
          We may transfer your personal data to countries outside the United States. In such cases, we ensure that appropriate safeguards are in place to protect your data.
        </p>

        <h2 style={{ textAlign: "left" }}>11. Children's Privacy</h2>
        <p style={{ textAlign: "left" }}>
          Our Service is not intended for children under the age of 13, and we do not knowingly collect personal data from children. If we learn that we have inadvertently collected personal data from a child under 13, we will take steps to delete that information.
        </p>

        <h2 style={{ textAlign: "left" }}>12. Changes to This Privacy Policy</h2>
        <p style={{ textAlign: "left" }}>
          We may update this Privacy Policy from time to time. When we do, we will post the revised version on our website with an updated date. Please review this Privacy Policy periodically for any changes.
        </p>

        <h2 style={{ textAlign: "left" }}>13. Contact Us</h2>
        <p style={{ textAlign: "left" }}>
          If you have any questions or concerns about this Privacy Policy or how we handle your personal data, please contact us through our website.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
