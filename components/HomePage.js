import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <h1>FINTRACK PRO</h1>
      <button onClick={() => navigate('/upload')}>Upload Your Data Set</button>
      <button onClick={() => navigate('/manual')}>Enter Data Manually</button>
    </div>
  );
};

export default HomePage;
