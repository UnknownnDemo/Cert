import React from 'react';
import './CenteredBox.css';
export const CenteredBox = () => {
  return (
    <div className="container">
      <div className="box">
        <p>A Decentralized Certificate Issuance and Verification System.</p>
        <div className="buttonContainer">
          <button className="actionButton">Issue</button>
          <button className="actionButton">Verify</button>
        </div>
      </div>
    </div>
  );
};
