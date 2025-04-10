import './App.css';
import React, { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from './Components/LoginSignup/RegistrationForm';
import LoginForm from './Components/LoginSignup/LoginForm';
import NavBar from './Components/NavBar';
import SearchPage from './Components/SearchPage';
import User from './Components/User_profile/User';
import BookPage from './Components/BookPage/BookPage';
import PrivateRoute from './Components/PrivateRoute';

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
          <Route path='/user' element={<PrivateRoute><User/></PrivateRoute>}/>
          <Route path='/book/:id' element={<BookPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
