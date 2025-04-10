import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token:", token);
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();
      if (isTokenExpired) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
    } catch (e) {
      console.log("Invalid token:", e);
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

  }, [navigate]);

  return <>{children}</>; 
};

export default ProtectedRoute;
