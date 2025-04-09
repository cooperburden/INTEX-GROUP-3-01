import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/privacy.css"

const Privacy = () => {
  return (
    <>
      <Header /> {/* Keep the header */}

      <div style={{
        textAlign: "left",
        paddingTop: "100px",
      }}>
        <h1>Privacy Policy for CineNiche</h1>
        <p><strong>Last updated:</strong> 08 April 2025</p>

        <p>
          CineNiche ("we," "us," or "our") is committed to protecting and respecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data
          when you access or use our streaming services ("Service"). This Privacy Policy applies to all
          users of our website and services.
        </p>

        <h2>1. Data Controller</h2>
        <p>The data controller responsible for the processing of your personal data is CineNiche.</p>

        <h2>2. Personal Data We Collect</h2>
        <p>We collect the following types of personal data when you use our Service:</p>
        <p><strong>Account Information:</strong> Name, email address, password, payment details, subscription information.</p>
        <p><strong>Usage Data:</strong> Information about your interactions with our website and content, including IP address, browser type, device type, location data, and viewing history.</p>
        <p><strong>Communication Data:</strong> Messages and communications with our support team.</p>

        <h2>3. How We Use Your Personal Data</h2>
        <p>We process your personal data for the following purposes:</p>
        <p><strong>Provide and Improve Services:</strong> To offer personalized recommendations, stream content, and enhance the user experience.</p>
        <p><strong>Account Management:</strong> To manage your subscription, process payments, and handle account-related queries.</p>
        <p><strong>Customer Support:</strong> To respond to your inquiries and provide customer service.</p>
        <p><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights.</p>
        <p><strong>Marketing:</strong> To send promotional emails or notifications (if you have opted in).</p>

        <h2>4. Lawful Basis for Processing</h2>
        <p>We process your personal data based on the following lawful bases:</p>
        <p><strong>Contractual Necessity:</strong> To perform our contract with you, including providing access to our services and handling payments.</p>
        <p><strong>Legitimate Interests:</strong> For improving our services, preventing fraud, and maintaining security.</p>
        <p><strong>Consent:</strong> For marketing communications, where you have explicitly opted in.</p>
        <p><strong>Legal Obligation:</strong> To comply with legal requirements, including tax and accounting obligations.</p>

        <h2>5. Sharing Your Personal Data</h2>
        <p>We may share your personal data with third parties in the following situations:</p>
        <p><strong>Service Providers:</strong> We may engage third-party providers to help with payment processing, email communication, analytics, and other services.</p>
        <p><strong>Legal Requirements:</strong> If required by law, we may share your data with government authorities or in response to legal processes.</p>
        <p><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your personal data may be transferred.</p>

        <h2>6. Data Retention</h2>
        <p>We will retain your personal data for as long as necessary to fulfill the purposes outlined in this Privacy Policy, or as required by law.</p>
        <p>This includes retaining data to comply with legal obligations, resolve disputes, and enforce agreements.</p>

        <h2>7. Your Rights</h2>
        <p>In the United States, you may have the following rights regarding your personal data, depending on your state:</p>
        <p><strong>Right to Access:</strong> You can request a copy of the personal data we hold about you.</p>
        <p><strong>Right to Rectification:</strong> You can request corrections to inaccurate or incomplete data.</p>
        <p><strong>Right to Erasure:</strong> You can request the deletion of your personal data under certain conditions.</p>
        <p><strong>Right to Restriction of Processing:</strong> You can request to limit how we process your data.</p>
        <p><strong>Right to Object:</strong> You can object to certain types of processing, including direct marketing.</p>
        <p><strong>Right to Data Portability:</strong> You can request your data in a structured, commonly used, and machine-readable format.</p>
        <p>To exercise any of these rights, please contact us through our website.</p>

        <h2>8. Security of Your Data</h2>
        <p>We take appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or alteration.</p>
        <p>However, no system is completely secure, and we cannot guarantee the absolute security of your data.</p>

        <h2>9. Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar technologies to enhance your experience and analyze usage patterns. You can manage your cookie preferences through your browser settings.</p>

        <h2>10. International Transfers</h2>
        <p>We may transfer your personal data to countries outside the United States. In such cases, we ensure that appropriate safeguards are in place to protect your data.</p>

        <h2>11. Children's Privacy</h2>
        <p>Our Service is not intended for children under the age of 13, and we do not knowingly collect personal data from children. If we learn that we have inadvertently collected personal data from a child under 13, we will take steps to delete that information.</p>

        <h2>12. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. When we do, we will post the revised version on our website with an updated date. Please review this Privacy Policy periodically for any changes.</p>

        <h2>13. Contact Us</h2>
        <p>If you have any questions or concerns about this Privacy Policy or how we handle your personal data, please contact us through our website.</p>
      </div>

      <Footer /> {/* Keep the footer */}
    </>
  );
};

export default Privacy;
