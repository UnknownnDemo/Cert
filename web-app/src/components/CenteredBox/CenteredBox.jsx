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
          <button className="actionButton">Verify</button>
        </div>
      </div>
    </div>
  );
};