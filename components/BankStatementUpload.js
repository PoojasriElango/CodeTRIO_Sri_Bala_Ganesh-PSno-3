import React, { useState } from 'react';
import Papa from 'papaparse';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import './BankStatementUpload.css';

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, LineElement, PointElement);

const BankStatementUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [chartType, setChartType] = useState('Bar'); // Chart type selector
  const [summary, setSummary] = useState(null); // To hold summary and analysis results
  const [selectedState, setSelectedState] = useState(''); // State selected by the user
  const [lineChartData, setLineChartData] = useState(null); // Data for the line chart

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Capture the selected file
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            processCSV(result.data); // Call processCSV with parsed CSV data
          },
        });
      };
      reader.readAsText(file); // Read the file as text
    } else {
      alert('Please upload a CSV file.');
    }
  };

  const processCSV = (csvData) => {
    if (!csvData || csvData.length === 0) {
      alert("The CSV file is empty or invalid.");
      return;
    }

    const labels = Object.keys(csvData[0]).filter(key => key !== "State");  // Extract years (excluding "State" column)
    const states = [...new Set(csvData.map(row => row["State"]))];  // Extract unique state names

    // Generate a distinct color for each state
    const colors = states.map(() => 
      `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`
    );

    const datasets = [{
      label: 'Average Values by State',  // Set label for the dataset
      data: states.map(state => {
        const total = labels.reduce((sum, label) => {
          const value = parseFloat(csvData.find(row => row["State"] === state)[label]) || 0; // Get the value for the state
          return sum + value;  // Calculate total for the state
        }, 0);
        return total / labels.length;  // Calculate average for the state
      }),
      backgroundColor: colors,  // Use the generated colors
    }];

    const chartData = {
      labels: states,  // X-axis: State names
      datasets,
    };

    setData(chartData);  // Set the chart data for visualization
    generateSummary(csvData, labels); // Generate summary and analysis
  };

  const generateSummary = (csvData, labels) => {
    const stateSummary = {};
    let highestState = "";
    let highestTotal = 0;

    csvData.forEach(row => {
      const state = row["State"];
      if (!stateSummary[state]) {
        stateSummary[state] = { total: 0, count: 0, yearlyData: {} }; // Include yearly data
      }
      labels.forEach(label => {
        const value = parseFloat(row[label]) || 0;
        stateSummary[state].total += value;
        stateSummary[state].count += 1;

        // Store yearly data for the state
        stateSummary[state].yearlyData[label] = (stateSummary[state].yearlyData[label] || 0) + value;
      });
      const average = stateSummary[state].total / stateSummary[state].count;
      if (average > highestTotal) {
        highestTotal = average;
        highestState = state;
      }
    });

    Object.keys(stateSummary).forEach(state => {
      stateSummary[state].avg = stateSummary[state].total / stateSummary[state].count; // Calculate average
    });

    // Get all states for summary and sort them by average value
    const allStates = Object.keys(stateSummary); 
    const sortedStates = allStates.sort((a, b) => stateSummary[b].avg - stateSummary[a].avg); // Sort by average

    // Get top 5 states
    const top5States = sortedStates.slice(0, 5);

    setSummary({ highestState, stateSummary, allStates, top5States }); // Set the summary data
  };

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state); // Update selected state
    generateLineChartData(state); // Generate line chart data for the selected state
  };

  const generateLineChartData = (state) => {
    if (state && summary) {
      const labels = Object.keys(summary.stateSummary[state].yearlyData); // Get years as labels
      const data = labels.map(label => {
        return summary.stateSummary[state].yearlyData[label] || 0; // Get values for the selected state
      });

      const chartData = {
        labels,
        datasets: [{
          label: state,
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }],
      };

      setLineChartData(chartData); // Set line chart data
    }
  };

  return (
    <div className="bank-statement-upload">
      <h2>Upload your file</h2>

      {/* File input to upload CSV */}
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Generate Graph</button>

      {/* Dropdown for chart type selection */}
      <div>
        <label>Select Chart Type:</label>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="Bar">Bar</option>
          <option value="Pie">Pie</option>
        </select>
      </div>

      {/* Display the chart once the data is ready */}
      {data && (
        <div>
          <h3>Generated Graph</h3>
          {chartType === 'Bar' && (
            <Bar
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'State Data Over the Years' },
                },
              }}
            />
          )}
          {chartType === 'Pie' && (
            <Pie
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Average Values by State' },
                },
              }}
            />
          )}
        </div>
      )}

      {/* State selection for line chart */}
      {summary && (
        <div>
          <label>Select State for Growth Trend:</label>
          <select value={selectedState} onChange={handleStateChange}>
            <option value="">Select a state</option>
            {summary.allStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      )}

      {/* Display line chart for selected state */}
      {lineChartData && (
        <div>
          <h3>Growth Trend for {selectedState}</h3>
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `Growth Trend of ${selectedState}` },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Years', // Label for x-axis
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Values', // Label for y-axis
                  },
                },
              },
            }}
          />
        </div>
      )}

      {/* Display summary and analysis */}
      {summary && (
        <div className="summary-section">
          <h3>Data Analysis Summary</h3>
          <p><strong>State with the highest average value:</strong> {summary.highestState || "N/A"}</p>

          {/* Display Top 5 States as Badges */}
          <h4>Top 5 States:</h4>
          <div className="badges-container">
            {summary.top5States.map(state => (
              <span key={state} className="badge">{state} (Avg: {summary.stateSummary[state].avg.toFixed(2)})</span>
            ))}
          </div>

          {/* Display summary table for all states */}
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Total</th>
                <th>Average</th>
              </tr>
            </thead>
            <tbody>
              {summary.allStates.map(state => (
                <tr key={state}>
                  <td>{state}</td>
                  <td>{summary.stateSummary[state].total.toFixed(2)}</td>
                  <td>{summary.stateSummary[state].avg.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total:</strong></td>
                <td><strong>{summary.allStates.reduce((total, state) => total + summary.stateSummary[state].total, 0).toFixed(2)}</strong></td>
                <td><strong>{(summary.allStates.reduce((total, state) => total + summary.stateSummary[state].avg, 0) / summary.allStates.length).toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BankStatementUpload;
