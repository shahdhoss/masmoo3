import logo from './logo.svg';
import './Components/Assets/css/tailwind.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from './Components/LoginSignup/RegistrationForm';
import LoginForm from './Components/LoginSignup/LoginForm';
import NavBar from './Components/NavBar';
import User from './Components/User/User';
import Edit from './Components/Edit_profile/Edit';
function App() {
  return (
    <div >
    <nav><NavBar/></nav>
    <Router>
      <Routes>
        <Route path='/signup' element={<RegistrationForm/>}></Route>
        <Route path='/login' element={<LoginForm/>}></Route>
        <Route path='/user' element={<User/>} ></Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
