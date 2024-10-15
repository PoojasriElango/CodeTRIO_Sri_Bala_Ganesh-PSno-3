import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import BankStatementUpload from './components/BankStatementUpload';
import ManualInput from './components/ManualInput';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload" element={<BankStatementUpload />} />
      <Route path="/manual" element={<ManualInput />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
