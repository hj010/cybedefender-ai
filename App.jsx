import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Show from "./assests/eye-open.svg";
import Hide from "./assests/eye-close.svg";
import Mainlogo from "./assests/famicons_logo-slack.png";
import Logo from "./assests/famicons_logo-slack (1).png";
import Dashboard from './components/Dashboard';
import Alerts from './components/Alerts';
import Reports from './components/Reports';
import Settings from './components/Setting';
import Support from './components/Support';
import ResetPasswordPage from './components/ResetPasswordPage';
import registrationCircle from './assests/Registration_circle.svg';
import Cookies from 'js-cookie';
import ProfileSettings from './components/ProfileSetting';
import TermsAndConditionsModal from './TermsAndConditionsModal';

function AuthPages({ isAuthenticated, setIsAuthenticated }) {
  const [activeTab, setActiveTab] = useState('Login');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  
  const resetFormData = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setError('');
    setForgotPassword(false);
    resetFormData();
    setRegistrationSuccess(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill out all fields.');
      return;
    }
    const loginData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_CYBEDEFENDER_AI_URL}/cybedefender/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      Cookies.set('token', data.token);
      Cookies.set('guid', data.guid);
      Cookies.set('email',data.email);
      Cookies.set('username',data.name);
      setIsAuthenticated(true);
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Error:', error);
    }
  
    console.log('Logging in with:', formData);
  };

  const handleForgotPasswordClick = () => {
    setForgotPassword(true);
    setError('');
    resetFormData();
  };

  const handleSendResetLink = async () => {
    if (!formData.email) {
      setError('Please enter your email.');
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_CYBEDEFENDER_AI_URL}/cybedefender/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send reset link.');
      }
  
      const data = await response.json();
      console.log('Reset link sent:', data);
      setResetLinkSent(true);
    } catch (error) {
      setResetLinkSent(true);
      setError('Failed to send reset link. Please try again.');
      console.error('Error:', error);
    }
  };

   // const handleResetPassword = async () => {
  //   if (!formData.password || !formData.confirmPassword) {
  //     setError('Please fill out all fields.');
  //     return;
  //   }
  //   if (formData.password !== formData.confirmPassword) {
  //     setError('Passwords do not match.');
  //     return;
  //   }
  //   if (!validatePassword(formData.password)) {
  //     setError('Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character.');
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_CYBEDEFENDER_AI_URL}/cybedefender/reset-password`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email: formData.email, // Email from the reset link
  //         newPassword: formData.password,
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to reset password.');
  //     }
  
  //     const data = await response.json();
  //     console.log('Password reset successful:', data);
  //     // setResetPasswordPage(false); // Go back to login page
  //     setError(''); // Clear any errors
  //     handleTabClick('Login'); // Redirect to login page
  //   } catch (error) {
  //     setError('Failed to reset password. Please try again.');
  //     console.error('Error:', error);
  //   }
  // };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character.');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the terms & conditions.');
      return;
    }

    const user_guid = uuidv4().replace(/-/g, '').substr(0, 16);

    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      user_guid: user_guid
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_CYBEDEFENDER_AI_URL}/cybedefender/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setRegistrationSuccess(true);
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibilityAgain = () => {
    setShowPasswordAgain(!showPasswordAgain);
  };

  const openTermsModal = (e) => {
    e.preventDefault();
    setIsTermsModalOpen(true);
  };

  const closeTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  return (
    <div className="container">
      <div className="left">
        <img src={Mainlogo} alt="Main Logo" className="main-logo" />
        <h1>Welcome to Cybedefender AI</h1>
        <p>Your Gateway to Effortless Management.</p>
      </div>
      <div className="right">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
          <h2>Cybedefender AI</h2>
        </div>

        {registrationSuccess ? (
          <div className="success-message">
            <div className="tick">
              <img
                src={registrationCircle}
                alt="checkcircle"
              />
            </div>
            <h3>Successfully Registered</h3>
            <p className="text-Grey-500 text-center mt-5">
              {'Return to'}{' '}
              <span
                className="cursor-pointer signIn"
                onClick={() => handleTabClick('Login')}
              >
                {'Sign In'}
              </span>
            </p>
          </div>
        ) : (
          <>
            {!forgotPassword && (
              <div className="tabs">
                <button
                  className={activeTab === 'Login' ? 'active' : ''}
                  onClick={() => handleTabClick('Login')}
                >
                  Login
                </button>
                <button
                  className={activeTab === 'Register' ? 'active' : ''}
                  onClick={() => handleTabClick('Register')}
                >
                  Registration
                </button>
              </div>
            )}
            {forgotPassword ? (
              resetLinkSent ? (
                <div className="success-message">
                  <div className="tick">
                    <img src={registrationCircle} alt="checkcircle" />
                  </div>
                  <h3>Reset Link Sent</h3>
                  <p className="text-Grey-500 text-center mt-5">
                    {'Check your email for the reset link.'}
                  </p>
                  <p className="text-Grey-500 text-center mt-5">
                    {'Return to'}{' '}
                    <span
                      className="cursor-pointer signIn"
                      onClick={() => handleTabClick('Login')}
                    >
                      {'Sign In'}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="form">
                  <h3>Forgot your password?</h3>
                  <p>Enter the email shared while creating the account. We'll send you a link to reset the password.</p>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <div className="button-and-link-container">
                    <button onClick={handleSendResetLink}>Send Reset Link</button>
                    <a
                      href="/"
                      className="back-to-signin"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabClick('Login');
                      }}
                    >
                      Back to Sign In
                    </a>
                  </div>
                </div>
              )
            ) : activeTab === 'Login' ? (
              <div className="form">
                <label className="form-label">Email Id</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />

                <label className="form-label">Password</label>
                <div className="password-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <img
                    className="toggleImage"
                    aria-label="toggle-password-visibility"
                    onClick={togglePasswordVisibility}
                    src={showPassword ? Show : Hide}
                    alt="show"
                  />
                </div>
                <a
                  href="forgotpassword"
                  className="forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    handleForgotPasswordClick();
                  }}
                >
                  Forgot Password?
                </a>
                <button onClick={handleLogin}>Login</button>
              </div>
            ) : (
              <div className="form">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <label className="form-label">Email Id</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <label className="form-label">Password</label>
                <div className="password-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <img
                    className="toggleImage"
                    aria-label="toggle-password-visibility"
                    onClick={togglePasswordVisibility}
                    src={showPassword ? Show : Hide}
                    alt="show"
                  />
                </div>
                <label className="form-label">Confirm Password </label>
                <div className="password-container">
                  <input
                    type={showPasswordAgain ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Enter your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <img
                    className="toggleImage"
                    aria-label="toggle-password-visibility"
                    onClick={togglePasswordVisibilityAgain}
                    src={showPasswordAgain ? Show : Hide}
                    alt="show"
                  />
                </div>
                <div className="terms">
                  <input type="checkbox" id="terms" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)}/>
                  <label htmlFor="terms">
                    I accept Company's <a href="/terms" onClick={openTermsModal}>Terms of use & Privacy Policy</a>.
                  </label>
                </div>
                <button onClick={handleRegister}>Register</button>
              </div>
            )}
          </>
        )}

        {error && <p className="error">{error}</p>}
      </div>

      {/* Terms and Conditions Modal - Render this conditionally */}
      {isTermsModalOpen && (
        <TermsAndConditionsModal 
          isOpen={isTermsModalOpen} 
          onClose={closeTermsModal} 
        />
      )}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <AuthPages
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/alerts"
          element={
            isAuthenticated ? (
              <Alerts onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/reports"
          element={
            isAuthenticated ? (
              <Reports onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <Settings onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/support"
          element={
            isAuthenticated ? (
              <Support onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
         <Route
          path="/profile-settings"
          element={
            isAuthenticated ? (
              <ProfileSettings onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;