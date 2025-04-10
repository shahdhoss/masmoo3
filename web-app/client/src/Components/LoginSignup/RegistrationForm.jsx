import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../Assets/css/style.css"; 
import "../Assets/fonts/material-design-iconic-font/css/material-design-iconic-font.min.css";
import registrationImg from "../Assets/images/registration-form-1.png";
import backgroundImage from "../Assets/images/bg-registration-form-1.jpg";
import axios from "axios";

const RegistrationForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    admincheck: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' 
    ? e.target.checked    
    : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    axios.post("http://localhost:8080/user", {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.admincheck ? "admin" : "user",
    })
    .then(() => {
      navigate("/login");
    })
    .catch((error) => {
      console.error("There was an error registering the user!", error);
      const message = error.response?.data?.message || 'Something went wrong';
      setErrorMessage(message);
    })
    .finally(() => {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        checked: false
      });
    });
  }
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
          <div className="form-group" style={{ display: "flex", alignItems: "center", marginBlock: "20px" }}>
            <label htmlFor="admincheck">Are you an admin?</label>
          <input
              type="checkbox"
              name="admincheck"
              onChange={handleChange}
              checked={formData.admincheck}
            />
          </div>
          <div className="form-group">
          {errorMessage ? <p>Error: {errorMessage}</p> : null}
          </div>

          <div className="form-wrapper">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} style={{ color: "blue", cursor: "pointer" }}> Login</span>
          </div>
          <button type="submit" >
            Register
            <i className="zmdi zmdi-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
};
export default RegistrationForm;
