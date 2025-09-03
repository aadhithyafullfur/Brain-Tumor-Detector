import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiImage, FiAlertCircle, FiCheckCircle, FiActivity, FiFileText } from 'react-icons/fi';
import './UploadForm.css';

function UploadForm({ onResult }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a medical imaging file for analysis.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:5000/predict', formData);
      setResult(response.data);
      onResult(response.data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || "Analysis failed. Please ensure the image is a valid MRI scan and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setError(null);
      setResult(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="header-section">
          <h2 className="medical-heading-large">
            <FiImage />
            Advanced MRI Diagnostic Analysis
          </h2>
          <p className="medical-text-large">
            Upload brain MRI scans for comprehensive AI-powered diagnostic evaluation
          </p>
          <span className="medical-badge">
            🔬 FDA-Compliant Clinical Analysis
          </span>
        </div>

        <div className="file-upload-area">
          <div 
            className="drop-zone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-input"
              className="file-input"
              onChange={handleFileChange}
              accept="image/*"
            />
            <label htmlFor="file-input" className="file-label">
              <FiUpload />
              Select MRI Imaging File
            </label>
            <p className="drop-text">or drag and drop your medical imaging file here</p>
            <p className="medical-text-small" style={{ marginTop: '15px', color: '#6b7280' }}>
              Supported formats: PNG, JPG, JPEG | Maximum file size: 10MB | 
              Recommended: High-resolution brain MRI scans
            </p>
          </div>
        </div>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="MRI Scan Preview" />
            <p className="file-name">
              <FiFileText style={{ marginRight: '8px' }} />
              {file.name}
            </p>
          </div>
        )}

        <button 
          className="upload-button" 
          onClick={handleUpload} 
          disabled={loading || !file}
        >
          {loading ? (
            <>
              <FiActivity />
              Processing Diagnostic Analysis...
            </>
          ) : (
            <>
              <FiCheckCircle />
              Initiate MRI Analysis
            </>
          )}
        </button>

        {loading && (
          <div className="processing-indicator">
            AI diagnostic model is analyzing the MRI scan. This may take several moments for comprehensive evaluation...
          </div>
        )}

        {error && (
          <div className="error">
            <FiAlertCircle />
            {error}
          </div>
        )}

        {result && (
          <div className="result">
            <h3>
              <FiCheckCircle />
              Diagnostic Analysis Complete
            </h3>
            <p className="result-text">
              <strong>Clinical Classification:</strong> {result.class}
            </p>
            <p className="result-text">
              <strong>Diagnostic Confidence Level:</strong> {result.confidence}%
            </p>
            <div className="medical-alert-info">
              <strong>Clinical Disclaimer:</strong> This AI analysis is for clinical reference only. 
              Final diagnosis and treatment decisions must be made by qualified medical professionals.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadForm;
