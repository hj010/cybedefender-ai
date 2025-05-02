// components/FileUploadModal.jsx
import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, RotateCcw } from 'lucide-react';
import Cookies from 'js-cookie'; // Make sure to install this package: npm install js-cookie

const FileUploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('initial'); // initial, uploading, success, failed
  const [uploadProgress, setUploadProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state variables to initial state
    setFile(null);
    setUploadStatus('initial');
    setUploadProgress(0);
    setTimeRemaining(null);
    setErrorMessage('');

    // Call the parent onClose function
    onClose();
  };

  const validateFileType = (file) => {
    if (!file.name.endsWith('.csv')) {
      setErrorMessage('Please upload a valid .csv file');
      return false;
    }
    return true;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (validateFileType(droppedFile)) {
        setFile(droppedFile);
        setErrorMessage('');
      } else {
        setFile(null);
        setUploadStatus('failed');
      }
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (validateFileType(selectedFile)) {
        setFile(selectedFile);
        setErrorMessage('');
      } else {
        setFile(null);
        setUploadStatus('failed');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    if (!validateFileType(file)) {
      setUploadStatus('failed');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage('');
    
    try {
      // Get userId from cookies
      const userId = Cookies.get('guid');
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      // Create FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      // Track upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
          setTimeRemaining(Math.round((100 - percentComplete) / 5) * 2); // Rough estimation
        }
      });

      // Handle XHR response
      xhr.onload = function() {
        if (xhr.status === 200) {
          setUploadStatus('success');
        } else {
          setUploadStatus('failed');
          setErrorMessage('Upload failed. Please try again later.');
        }
      };

      xhr.onerror = function() {
        setUploadStatus('failed');
        setErrorMessage('Network error occurred during upload');
      };

      // Open and send the request
      xhr.open('POST', 'https://www.cybedefenderai.com/upload', true);
      xhr.send(formData);
    } catch (error) {
      setUploadStatus('failed');
      setErrorMessage(error.message || 'An error occurred during upload');
    }
  };

  const handleRetry = () => {
    setUploadStatus('initial');
    setUploadProgress(0);
    setTimeRemaining(null);
    setErrorMessage('');
  };

  const renderContent = () => {
    switch (uploadStatus) {
      case 'initial':
        return (
            <>
              {!file ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                  <p className="text-gray-400 text-sm mb-4">Only .csv format, up to 5MB</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Download sample file <a href="#" className="text-blue-600">here</a>.
                  </p>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileSelect}
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded">
                        <span className="text-xs font-medium">CSV</span>
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)}MB</p>
                      </div>
                    </div>
                    <button onClick={() => setFile(null)}>
                      <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </>
        );

      case 'uploading':
        return (
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded">
                <span className="text-xs font-medium">CSV</span>
              </div>
              <div>
                <p className="font-medium">Uploading...</p>
                <p className="text-sm text-gray-500">{timeRemaining} seconds remaining</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded">
                  <span className="text-xs font-medium">CSV</span>
                </div>
                <div>
                  <p className="font-medium">{file?.name}</p>
                  <p className="text-sm text-green-500">File Uploaded Successfully</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded">
                  <span className="text-xs font-medium">Error</span>
                </div>
                <div>
                  <p className="font-medium">{file?.name || "Upload Failed"}</p>
                  <p className="text-sm text-red-500">
                    {errorMessage || "Upload failed. Please upload a valid .csv format."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleRetry}>
                  <RotateCcw className="w-5 h-5 text-gray-500 hover:text-blue-500" />
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 pb-2 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">Upload File</h2>
              <p className="text-gray-600">Select the file to upload</p>
            </div>
            <button onClick={handleClose}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>
        
        <div className="p-4 pt-1">
          {renderContent()}
        </div>
  
        {file && uploadStatus !== 'failed' && (
          <div className="flex justify-end gap-2 p-4 pt-0 border-t">
            {uploadStatus === 'initial' || uploadStatus === 'uploading' ? (
              <>
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  onClick={handleClose}
                  disabled={uploadStatus === 'uploading'}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  onClick={handleUpload}
                  disabled={uploadStatus === 'uploading'}
                >
                  Upload
                </button>
              </>
            ) : (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleClose}
              >
                Done
              </button>
            )}
          </div>
        )}
        
        {uploadStatus === 'failed' && (
          <div className="flex justify-end gap-2 p-4 pt-0 border-t">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleRetry}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadModal;