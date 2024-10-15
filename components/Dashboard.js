import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="expense-boxes">
        <div className="expense-box">Rent</div>
        <div className="expense-box">Food</div>
        <div className="expense-box">Travel</div>
        <div className="expense-box">Entertainment</div>
        <div className="expense-box">Others</div>
        <button className="add-field-button">Add Field</button>
      </div>

      <div className="graph-options">
        <button>3D Bar Chart</button>
        <button>3D Pie Chart</button>
        <button>3D Line Chart</button>
      </div>

      <button className="clear-history">Clear History</button>
      <button className="reenter-values">Reenter Values</button>
      <button className="view-statement" onClick={() => navigate('/upload')}>Your Bank Statement</button>
    </div>
  );
};

export default Dashboard;
