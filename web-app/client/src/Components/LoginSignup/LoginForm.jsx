import React, { useState } from "react";
import "../Assets/css/style.css"; 
import "../Assets/fonts/material-design-iconic-font/css/material-design-iconic-font.min.css";
import backgroundImage from "../Assets/images/bg-registration-form-1.jpg";
import registrationImg from "../Assets/images/loginpic.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    axios.post("http://localhost:8080/user/login", {
      email: formData.email,
      password: formData.password,
    })
    .then((response) => {
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/user");
    })
    .catch((error) => {
      console.error("There was an error logging in!", error);
      const message = error.response?.data?.message || 'Something went wrong';
      setErrorMessage(message)
    })
    .finally(() => {
      setFormData({
        email: "",
        password: ""
      });
    });
  };

  return (
    
    <div className="wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>      
    <div className="inner">
        <div className="image-holder">
        <img src={registrationImg} alt="Registration" />
        </div>
        <form onSubmit={handleSubmit}>
          <h3>Login</h3>
          <div className="form-wrapper">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
            <i className="zmdi zmdi-email"></i>
          </div>
          <div className="form-wrapper">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
            <i className="zmdi zmdi-lock"></i>
          </div>
          <div className="form-group">
          {errorMessage ? <p>Error: {errorMessage}</p> : null}
          </div>
          <div className="form-group">
          <p>
        Don't have an account yet?{" "}
        <span onClick={() => navigate("/signup")} style={{ color: "blue", cursor: "pointer" }}> Sign up</span>
      </p>
          </div>
          <button type="submit">
            Submit
            <i className="zmdi zmdi-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
