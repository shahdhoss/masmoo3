import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../Assets/css/style.css"; 
import "../Assets/fonts/material-design-iconic-font/css/material-design-iconic-font.min.css";
import registrationImg from "../Assets/images/registration-form-1.png";
import backgroundImage from "../Assets/images/bg-registration-form-1.jpg";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };
  
  const navigate = useNavigate();

  return (
    <div className="wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>      
    <div className="inner">
        <div className="image-holder">
          <img src={registrationImg} alt="Registration" />
        </div>
        <form onSubmit={handleSubmit}>
          <h3>Signup Now</h3>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="form-control"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="form-control"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
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
          <div className="form-wrapper">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <i className="zmdi zmdi-lock"></i>
          </div>
          <div className="form-group">
          <p>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} style={{ color: "blue", cursor: "pointer" }}> Login</span>
      </p>
          </div>
          <button type="submit">
            Register
            <i className="zmdi zmdi-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
