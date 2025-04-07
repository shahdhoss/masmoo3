import './Components/Assets/css/tailwind.css';
import './App.css';
import React, { useState } from "react"; // Correctly import useState from React
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from './Components/LoginSignup/RegistrationForm';
import LoginForm from './Components/LoginSignup/LoginForm';
import Logintest from './Components/LoginSignup/Logintest';
import NavBar from './Components/NavBar';
import SearchPage from './Components/SearchPage';

function App() {
  const [searchWord, setSearchWord] = useState("");
  return (
    <div>
      <nav><NavBar searchWord={searchWord} setSearchWord={setSearchWord} /></nav>
      {searchWord ? (
        <SearchPage searchWord={searchWord} />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold">Welcome to the App!</h1>
        </div>
      )}
      <Router>
        <Routes>
          <Route path='/signup' element={<RegistrationForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/success' element={<Logintest />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
