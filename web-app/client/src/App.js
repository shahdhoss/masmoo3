import './Components/Assets/css/tailwind.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from './Components/LoginSignup/RegistrationForm';
import LoginForm from './Components/LoginSignup/LoginForm';
import Logintest from './Components/LoginSignup/Logintest';
import NavBar from './Components/NavBar';
import SearchPage from './Components/SearchPage';
function App() {
  return (
    <div >
    <nav><NavBar/></nav>
    <Router>
      <Routes>
        <Route path='/signup' element={<RegistrationForm/>}></Route>
        <Route path='/login' element={<LoginForm/>}></Route>
        <Route path='/success' element={<Logintest/>}></Route>
        <Route path='/search' element={<SearchPage/>}></Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
