import React from 'react';
import styles from "./App.module.css";
import { Navbar } from "./components/Navbar/Navbar";
import { CenteredBox } from './components/CenteredBox/CenteredBox';
import backgroundImage from './assets/background.jpg'; // Import your image

function App() {
  return (
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
      <CenteredBox />
    </div>
  );
}

export default App;
