import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Mainlogo from '../assests/famicons_logo-slack.png';
import Logo from '../assests/famicons_logo-slack (1).png';
import Show from '../assests/eye-open.svg';
import Hide from '../assests/eye-close.svg';
import successTick from '../assests/Registration_circle.svg'; // Ensure you have a tick icon
import '../App.css'; // Ensure necessary styles

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate(); // For navigation
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);



  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibilityAgain = () => {
    setShowPasswordAgain(!showPasswordAgain);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character.');
      return;
    }

    try {
      const response = await fetch('https://www.cybedefenderai.com/cybedefender/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password.');
      }

      setSuccess(true);
      setError('');
    } catch (error) {
      // setSuccess(true);

      setError('Failed to reset password. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      {/* Left Side */}
      <div className="left">
        <img src={Mainlogo} alt="Main Logo" className="main-logo" />
        <h1>Welcome to Cybedefender AI</h1>
        <p>Your Gateway to Effortless Management.</p>
      </div>

      {/* Right Side */}
      <div className="right">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
          <h2>Cybedefender AI</h2>
        </div>

        {/* Success Message */}
        {success ? (
          <div className="success-message">
            <div className="tick">
              <img src={successTick} alt="Success" />
            </div>
            <h3>Password Reset Successfully</h3>
            <p className="text-Grey-500 text-center mt-5">
              Return to{' '}
              <span
                className="cursor-pointer signIn"
                onClick={() => navigate('/')} // Navigate to Login Page
              >
                Sign In
              </span>
            </p>
          </div>
        ) : (
          /* Reset Password Form */
          <div className="form">
            <h3>Reset Your Password</h3>
            <label className="form-label">New Password</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
               <img
                    className="toggleImage"
                    aria-label="toggle-password-visibility"
                    onClick={togglePasswordVisibility}
                    src={showPassword ? Show : Hide}
                    alt="show"
                  />
                
            </div>
            <label className="form-label">Confirm New Password</label>
            <div className="password-container">
              <input
                type={showPasswordAgain ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <img
                    className="toggleImage"
                    aria-label="toggle-password-visibility"
                    onClick={togglePasswordVisibilityAgain}
                    src={showPasswordAgain ? Show : Hide}
                    alt="show"
                  />
            </div>  
            <button onClick={handleResetPassword}>Reset Password</button>
            {error && <p className="error">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
