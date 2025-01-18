import React from 'react';
import styles from "./App.module.css";
import Main from './components/Main';
import { Navbar } from "./components/Navbar/Navbar";

function App() {
  return (
   
     <div className={styles.App}><Navbar/><Main /></div>
  );
}

export default App;
