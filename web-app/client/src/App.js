import logo from './logo.svg';
import './Components/Assets/css/tailwind.css';
import './App.css';
<<<<<<< Updated upstream

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from './Components/LoginSignup/RegistrationForm';
import LoginForm from './Components/LoginSignup/LoginForm';
import Logintest from './Components/LoginSignup/Logintest';
import NavBar from './Components/NavBar';
function App() {
  return (
    <div >
    <nav><NavBar/></nav>
    <Router>
      <Routes>
        <Route path='/signup' element={<RegistrationForm/>}></Route>
        <Route path='/login' element={<LoginForm/>}></Route>
        <Route path='/success' element={<Logintest/>}></Route>
      </Routes>
    </Router>
>>>>>>> Stashed changes
    </div>
  );
}

export default App;
