import React, { useState } from 'react';

const Verify = () => {
  const [certId, setCertId] = useState('');
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Sample valid certificate IDs - in real application, this would come from an API/database
  const validCertIds = ['CERT123', 'CERT456', 'CERT789'];

  const handleVerify = (e) => {
    e.preventDefault();
    
    if (!certId) {
      setMessage('Please enter a certificate ID');
      return;
    }

    setIsVerifying(true);
    setMessage('');

    // Simulate API call
    setTimeout(() => {
      const isValid = validCertIds.includes(certId.toUpperCase());
      setMessage(isValid ? 'Certificate is valid' : 'Invalid certificate ID');
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 20px' }}>Verify Certificate</h2>
        
        <input
          type="text"
          value={certId}
          onChange={(e) => setCertId(e.target.value.toUpperCase())}
          placeholder="Enter Certificate ID"
          style={{
            padding: '8px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />

        <button
          type="submit"
          disabled={isVerifying}
          style={{
            padding: '10px',
            fontSize: '16px',
            backgroundColor: isVerifying ? '#ccc' : '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isVerifying ? 'not-allowed' : 'pointer'
          }}
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>

        {message && (
          <div style={{
            padding: '10px',
            marginTop: '10px',
            backgroundColor: message === 'Certificate is valid' ? '#e6ffe6' : '#ffe6e6',
            border: `1px solid ${message === 'Certificate is valid' ? '#99ff99' : '#ffcccc'}`,
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Verify;