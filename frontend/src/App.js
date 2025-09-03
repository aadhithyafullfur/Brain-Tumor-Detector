import React, { useState, useRef } from 'react';
import UploadForm from './components/UploadForm';
import ResultChart from './components/ResultChart';
import HospitalAuth from './components/HospitalAuth';
import logoImage from './assets/logo.png';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Removed hospitalId state to fix warning
  const [resultData, setResultData] = useState(null);
  const chartRef = useRef(null);

  const handleResult = (data) => {
    setResultData(data);
  };

  const scrollToChart = () => {
    if (!resultData) {
      alert("Please upload an MRI scan to get the prediction before viewing visualization.");
      return;
    }
    if (chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setResultData(null);
  };

  if (!isLoggedIn) {
    return (
      <HospitalAuth
        onAuthSuccess={() => {
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">
          <img src={logoImage} alt="Logo" className="logo-img" />
          Tumor Detector
        </div>

        <div className="nav-info">
          <button className="nav-btn" onClick={scrollToChart}>Clinical Reports</button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <header className="App-header">
        <h1>Brain Tumor MRI Analysis System</h1>
        <p>Advanced AI-powered diagnostic tool for medical professionals</p>
        <p className="subtitle">FDA-compliant analysis with clinical-grade accuracy</p>
      </header>

      <main>
        <UploadForm onResult={handleResult} />
        {resultData && (
          <div ref={chartRef}>
            <ResultChart result={resultData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
