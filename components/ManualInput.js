import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManualInput.css';
import { BarChart, Bar, PieChart, Pie, Tooltip, Cell, XAxis, YAxis } from 'recharts';

const ManualInput = () => {
  const [expenses, setExpenses] = useState({ food: 0, entertainment: 0, travel: 0, others: 0 });
  const [chartType, setChartType] = useState('bar');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenses({ ...expenses, [name]: Number(value) });
  };

  const data = [
    { name: 'Food', value: expenses.food },
    { name: 'Entertainment', value: expenses.entertainment },
    { name: 'Travel', value: expenses.travel },
    { name: 'Others', value: expenses.others },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="manual-input-page">
      <h1>Manual Expense Input</h1>
      <div className="inputs">
        <input type="number" name="food" placeholder="Food Expense" onChange={handleInputChange} />
        <input type="number" name="entertainment" placeholder="Entertainment Expense" onChange={handleInputChange} />
        <input type="number" name="travel" placeholder="Travel Expense" onChange={handleInputChange} />
        <input type="number" name="others" placeholder="Other Expense" onChange={handleInputChange} />
      </div>

      <div className="chart-buttons">
        <button onClick={() => setChartType('bar')}>Bar Chart</button>
        <button onClick={() => setChartType('pie')}>Pie Chart</button>
      </div>

      {chartType === 'bar' ? (
        <BarChart width={500} height={300} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      ) : (
        <PieChart width={500} height={300}>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      )}

      <button className="back-button" onClick={() => navigate('/')}>Back</button>
    </div>
  );
};

export default ManualInput;
