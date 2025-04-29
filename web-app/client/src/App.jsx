import './App.css';
import 'process/browser';
import React, { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from './Components/LoginSignup/RegistrationForm';
import LoginForm from './Components/LoginSignup/LoginForm';
import NavBar from './Components/NavBar';
import SearchPage from './Components/SearchPage';
import User from './Components/User_profile/User';
import BookPage from './Components/BookPage/BookPage';
import PrivateRoute from './Components/PrivateRoute';
import AudioRoom from './Components/Stream/BookClubPage';
import Streamer from './Components/Stream/Streamer';
import Listener from './Components/Stream/Listener';
import StreamerMeetLayout from './Components/Stream/StreamerMeetLayout';
import ListenerMeetLayout from './Components/Stream/ListenerMeetLayout';

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
          <Route path='/stream' element={<AudioRoom/>} />
          <Route path="/streamer/:roomName" element={<Streamer/>} />
          <Route path= "/listener/:roomName" element={<Listener/>}/>
          <Route path= "/streamerLayout/:roomName" element={<StreamerMeetLayout/>}/>
          <Route path='listenerLayout/:roomName' element = {<ListenerMeetLayout/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
