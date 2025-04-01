import React, { useState } from "react";
import "../Assets/css/style.css"; 
import "../Assets/fonts/material-design-iconic-font/css/material-design-iconic-font.min.css";
import backgroundImage from "../Assets/images/bg-registration-form-1.jpg";
import registrationImg from "../Assets/images/image.png";


const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
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
