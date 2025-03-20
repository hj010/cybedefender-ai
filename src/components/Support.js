// components/Support.js
import React, { useState } from 'react';
import { LifeBuoy } from 'lucide-react';
import AppLayout from './Layout';

const Support = ({ onLogout }) => {
  const [formData, setFormData] = useState({
    email: '',
    query: ''
  });
  const [status, setStatus] = useState({
    message: '',
    type: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate inputs
    if (!formData.email || !formData.query) {
      setStatus({
        message: 'Please fill out all fields',
        type: 'error'
      });
      return;
    }
  
    try {
      // Get userid and token from cookies
      const userid = document.cookie
        .split('; ')
        .find(row => row.startsWith('guid='))
        ?.split('=')[1];
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
  
      if (!userid || !token) {
        setStatus({
          message: 'Authentication error: Missing userid or token',
          type: 'error'
        });
        return;
      }
  
      // Make API call
      const response = await fetch('http://127.0.0.1:5000/cybedefender/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userid,
          email: formData.email,
          query: formData.query
        })
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      // Show success message
      setStatus({
        message: 'Your query has been submitted successfully. We will get back to you soon.',
        type: 'success'
      });
  
      // Reset form
      setFormData({
        email: '',
        query: ''
      });
    } catch (error) {
      setStatus({
        message: error.message || 'Failed to send your query. Please try again later.',
        type: 'error'
      });
    }
  
    // Clear status message after 5 seconds
    setTimeout(() => {
      setStatus({
        message: '',
        type: ''
      });
    }, 5000);
  };
  

  return (
    <AppLayout onLogout={onLogout}>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <LifeBuoy className="h-8 w-8 text-blue-500" />
          <h2 className="text-xl font-semibold">Customer Support</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Need help or have questions? Fill out the form below and our support team will assist you.
        </p>
        
        {status.message && (
          <div className={`mb-6 p-4 rounded-md ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
              Your Question or Issue
            </label>
            <textarea
              id="query"
              name="query"
              value={formData.query}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please describe your issue or question in detail..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Support;