import React, { useState } from 'react';
import '../style/verify.css'; // Import the CSS file

const Verify = () => {
  const [certId, setCertId] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validCertificates = {
    'CERT1234': 'Valid certificate for John Doe',
    'CERT5678': 'Valid certificate for Jane Smith'
  };

  const handleVerifyClick = () => {
    if (!certId.trim()) {
      setStatus('Please enter a certificate ID');
      return;
    }

    setIsLoading(true);
    setStatus('');

    // Simulate verification delay
    setTimeout(() => {
      if (validCertificates[certId.toUpperCase()]) {
        setStatus(validCertificates[certId.toUpperCase()]);
      } else {
        setStatus('Invalid certificate ID');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (event) => {
    // Clean input as user types
    setCertId(event.target.value.replace(/[^A-Za-z0-9]/g, ''));
  };

  return (
    <div className="container">
      <h1>Certificate Verification</h1>
      
      <div className="input-field">
        <label htmlFor="certId">Certificate ID</label>
        <input 
          type="text" 
          id="certId" 
          placeholder="Enter certificate ID"
          value={certId}
          onChange={handleInputChange}
          maxLength="20"
        />
      </div>

      <button onClick={handleVerifyClick} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify Certificate'}
      </button>

      {isLoading && <div className="spinner"></div>}

      <div className={`status ${status === 'Valid certificate for John Doe' || status === 'Valid certificate for Jane Smith' ? 'valid' : 'invalid'}`}>
        {status}
      </div>
    </div>
  );
}

export default Verify;
