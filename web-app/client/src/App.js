import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from './Components/LoginSignup/RegistrationForm';
import LoginForm from './Components/LoginSignup/LoginForm';
import Logintest from './Components/LoginSignup/Logintest';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<RegistrationForm/>}></Route>
        <Route path='/login' element={<LoginForm/>}></Route>
        <Route path='/success' element={<Logintest/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
