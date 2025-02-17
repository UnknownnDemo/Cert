import React from 'react';
import { Link } from 'react-router-dom';
import './CenteredBox.css';
export const CenteredBox = () => {
  return (
    <div className="container">
      <div className="box">
        <p>A Decentralized Certificate Issuance and Verification System.</p>
        <div className="buttonContainer">
        <Link to="/issue">
          <button className="actionButton">Issue</button>
          </Link>
          <Link to="/verify">
          <button className="actionButton">Verify</button>
          </Link>
        </div>
      </div>
    </div>
  );
};