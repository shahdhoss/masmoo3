import './Components/Assets/css/tailwind.css';
import './App.css';
import React, { useState } from "react"; // Correctly import useState from React
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from './Components/LoginSignup/RegistrationForm';
import LoginForm from './Components/LoginSignup/LoginForm';
import NavBar from './Components/NavBar';
import SearchPage from './Components/SearchPage';
import User from './Components/User/User';

function App() {
  return (
    <div>
      <Router>
        <nav><NavBar/></nav>
        <Routes>
          <Route path='/search' element={<SearchPage />} />
          <Route path='/search/:keyword' element={<SearchPage />} />
          <Route path='/signup' element={<RegistrationForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/user' element={<User/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
