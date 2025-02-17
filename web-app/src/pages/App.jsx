import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from "../style/App.module.css";
import { Navbar } from "../components/Navbar/Navbar";
import { CenteredBox } from '../components/CenteredBox/CenteredBox';
import Issue from './Issue';
import backgroundImage from '../assets/background.jpg'; // Import your image
import Verify from './Verify';

function App() {
  return (
    <Router>
    <div
      className={styles.App}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover', // Cover the entire div
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat', // Avoid tiling
        height: '100vh', // Full height
        width: '100%', // Full width
      }}
    >
      <Navbar />
      <Routes>
          <Route path="/" element={<CenteredBox />} />
          <Route path="/issue" element={<Issue />} />
          <Route path="/verify" element={<Verify />} />  
        </Routes>
    </div>
    </Router>
  );
}

export default App;
