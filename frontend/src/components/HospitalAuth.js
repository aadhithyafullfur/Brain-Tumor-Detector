import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import img2 from '../assets/img2.png';

function HospitalAuth({ onAuthSuccess }) {
  const [hospitalId, setHospitalId] = useState('');
  const [password, setPassword] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'signup';
    const payload = {
      hospital_id: hospitalId,
      password: password,
    };

    // Add name and phone only if signup
    if (!isLogin) {
      payload.hospital_name = hospitalName;
      payload.phone_number = phoneNumber;
    }

    try {
      const res = await axios.post(`http://localhost:5000/${endpoint}`, payload);

      if (res.status === 200) {
        if (isLogin) {
          onAuthSuccess(hospitalId);
        } else {
          setMessage('Signup successful! Please login.');
          setIsLogin(true);
        }
        setError('');
      }
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.error || `${isLogin ? 'Login' : 'Signup'} failed.`);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content">
        <div className="auth-image">
          <img src={img2} alt="Hospital AI Visual" />
        </div>
        <div className="auth-card">
          <h2>{isLogin ? 'Hospital Login' : 'Hospital Signup'}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="hospitalId">Hospital ID</label>
            <input
              type="text"
              id="hospitalId"
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              placeholder="Enter Hospital ID"
              required
            />

            {!isLogin && (
              <>
                <label htmlFor="hospitalName">Hospital Name</label>
                <input
                  type="text"
                  id="hospitalName"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="Enter Hospital Name"
                  required
                />

                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter Phone Number"
                  required
                />
              </>
            )}

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />

            <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>

            {message && <p className="success-msg">{message}</p>}
            {error && <p className="error-msg">{error}</p>}
          </form>

          <div className="switch-auth">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <span onClick={() => { setIsLogin(false); setMessage(''); setError(''); }}>
                  Signup here
                </span>
              </>
            ) : (
              <>
                Already registered?{' '}
                <span onClick={() => { setIsLogin(true); setMessage(''); setError(''); }}>
                  Login here
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalAuth;
