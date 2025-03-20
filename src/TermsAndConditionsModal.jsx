import React from 'react';

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Terms and Conditions</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          <h3 className="effective-date">Effective Date: 23 March 2025</h3>
          <div className="welcome-text">
            <p>Welcome to Cybedefender AI! By registering for an account or logging into our platform, you agree to comply with the following terms and conditions. Please read them carefully before proceeding.</p>
          </div>

          <div className="section">
            <h4 className="section-title">1. Acceptance of Terms</h4>
            <p>By creating an account or using Cybedefender AI, you agree to:</p>
            <ul className="custom-bullet">
              <li>Be bound by these Terms and Conditions.</li>
              <li>Comply with any applicable laws and regulations.</li>
              <li>Accept that Cybedefender AI may update these terms from time to time, and continued use of the platform constitutes acceptance of those changes.</li>
            </ul>
          </div>

          <div className="section">
            <h4 className="section-title">2. User Eligibility</h4>
            <p>If registering on behalf of an organization, you represent and warrant that you have the authority to bind the organization to these terms.</p>
          </div>

          <div className="section">
            <h4 className="section-title">3. Account Responsibilities</h4>
            <p><strong>Accuracy of Information:</strong> You agree to provide accurate, complete, and up-to-date information during registration.</p>
            <p><strong>Confidentiality:</strong> You are responsible for maintaining the confidentiality of your account credentials. Cybedefender AI will not be liable for any loss or damage arising from unauthorized access to your account.</p>
            <p><strong>Prohibited Activities:</strong></p>
            <ul className="custom-bullet">
              <li>Sharing login credentials with unauthorized parties.</li>
              <li>Using another user's account without permission.</li>
              <li>Engaging in fraudulent or malicious activities.</li>
            </ul>
          </div>

          <div className="section">
            <h4 className="section-title">4. Data Usage and Privacy</h4>
            <p>By using Cybedefender AI, you consent to the collection, storage, and processing of your data as outlined in our Privacy Policy.</p>
            <p>Cybedefender AI uses industry-standard encryption and security measures to protect your data.</p>
            <p>You retain ownership of your uploaded data. However, Cybedefender AI may analyze and process this data to deliver platform functionalities (e.g., anomaly detection).</p>
          </div>

          <div className="section">
            <h4 className="section-title">5. Platform Use</h4>
            <p>You agree to use Cybedefender AI solely for lawful purposes. Prohibited uses include:</p>
            <ul className="custom-bullet">
              <li>Uploading malicious files</li>
              <li>Exploiting vulnerabilities</li>
              <li>Engaging in disruptive activities</li>
            </ul>
          </div>

          <div className="section">
            <h4 className="section-title">6. Intellectual Property</h4>
            <p>Cybedefender AI owns all intellectual property rights to the platform, including designs, algorithms, and content. You may not:</p>
            <ul className="custom-bullet">
              <li>Copy, reproduce, or redistribute platform elements without written consent</li>
              <li>Reverse-engineer any part of the platform</li>
            </ul>
          </div>

          <div className="section">
            <h4 className="section-title">7. Termination of Account</h4>
            <p>Cybedefender AI reserves the right to suspend or terminate accounts that violate these terms or engage in unauthorized or harmful activities.</p>
            <p>Users may request account deletion by contacting support at <a href="mailto:support@cybedefenderai.com">support@cybedefenderai.com</a>.</p>
          </div>

          <div className="section">
            <h4 className="section-title">8. Limitation of Liability</h4>
            <p>Cybedefender AI is provided on an "as-is" and "as-available" basis without guarantees of error-free or uninterrupted service.</p>
            <p>We are not liable for indirect, incidental, or consequential damages or data loss resulting from user error or platform issues.</p>
          </div>

          <div className="section">
            <h4 className="section-title">9. Governing Law</h4>
            <p>These terms shall be governed by and construed in accordance with the laws.</p>
          </div>

          <div className="section">
            <h4 className="section-title">10. Contact Information</h4>
            <p>If you have questions or concerns about these Terms and Conditions, please contact us at:</p>
            <p>Email: <a href="mailto:support@cybedefenderai.com">support@cybedefenderai.com</a></p>
          </div>

          <div className="section agreement">
            <h4 className="section-title">Agreement</h4>
            <p>By clicking "Register" or logging into Cybedefender AI, you acknowledge that you have read, understood, and agree to these Terms and Conditions.</p>
          </div>

          <div className="modal-footer">
            <button className="accept-button" onClick={onClose}>I Understand</button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
          background-color: #f8f9fa;
          border-radius: 8px 8px 0 0;
        }
        
        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #333;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          transition: color 0.2s;
        }
        
        .close-button:hover {
          color: #000;
        }
        
        .modal-content {
          padding: 24px;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #333;
        }
        
        .effective-date {
          font-size: 1.1rem;
          color: #555;
          margin-top: 0;
          margin-bottom: 20px;
          font-weight: 500;
        }
        
        .welcome-text {
          margin-bottom: 24px;
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .section {
          margin-bottom: 24px;
          padding-bottom: 8px;
        }
        
        .section-title {
          font-size: 1.1rem;
          color: #2c3e50;
          margin-top: 0;
          margin-bottom: 12px;
          font-weight: 600;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 8px;
        }
        
        .custom-bullet {
          padding-left: 20px;
          margin-top: 8px;
          margin-bottom: 16px;
        }
        
        .custom-bullet li {
          margin-bottom: 8px;
          position: relative;
          padding-left: 8px;
          list-style-type: none;
        }
        
        .custom-bullet li:before {
          content: "•";
          color: #007bff;
          font-weight: bold;
          display: inline-block;
          width: 1em;
          margin-left: -1em;
        }
        
        .modal-content p {
          margin-top: 0;
          margin-bottom: 12px;
        }
        
        .modal-content a {
          color: #007bff;
          text-decoration: none;
        }
        
        .modal-content a:hover {
          text-decoration: underline;
        }
        
        .agreement {
          background-color: #f8f9fa;
          padding: 16px;
          border-radius: 6px;
          border-left: 4px solid #007bff;
        }
        
        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #eee;
          text-align: right;
          background-color: #f8f9fa;
          border-radius: 0 0 8px 8px;
        }
        
        .accept-button {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .accept-button:hover {
          background-color: #337fd0;
        }

        @media (max-width: 600px) {
          .modal-content {
            padding: 16px;
            font-size: 0.9rem;
          }
          
          .section-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TermsAndConditionsModal;