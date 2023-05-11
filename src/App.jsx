import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./App.css";

Chart.register(...registerables);

const API_ENDPOINT = "http://localhost:5000/api/v1/timeSeries/";

const option = {
  responsive: true,
  type: 'scale',
  plugins: {
    legend: { position: "chartArea" },
    title: {
      display: true,
      text: "Currency Flow",
    },
  },
};

export default function App() {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(false);


  const handleOpen = () => {
    setOpen(!open);
  };

  // Date wise data
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Inflow',
        data: [],
        backgroundColor: '#8150C3',
      },
      {
        label: 'Outflow',
        data: [],
        backgroundColor: '#5ECAC7',
      },
    ],
  });

// Year wise data
  const [chartDataYear, setChartDataYear] = useState({
    labels: [],
    datasets: [
      {
        label: 'Inflow',
        data: [],
        backgroundColor: '#8150C3',
      },
      {
        label: 'Outflow',
        data: [],
        backgroundColor: '#5ECAC7',
      },
    ],
  });

  const fetchTimeSeries = () => {
    fetch(API_ENDPOINT)
      .then(response => response.json())
      .then(fetchedData => {
        let labels = fetchedData.map(data => data.date);
        let inflowData = fetchedData.map(data => data.inflow);
        let outflowData = fetchedData.map(data => data.outflow);

        let updatedChartData = {
          ...chartData,
          labels: labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: inflowData,
            },
            {
              ...chartData.datasets[1],
              data: outflowData,
            },
          ],
        };
        setYear(true);
        setChartData(updatedChartData);
     
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const fetchTimeSeriesYear = () => {
    fetch( "http://localhost:5000/api/v1/timeSeries/year")
      .then(response => response.json())
      .then(fetchedData => {
        let labels = fetchedData.map(data => data.year);
        let inflowData = fetchedData.map(data => data.inflow);
        let outflowData = fetchedData.map(data => data.outflow);

        let updatedChartDataYear = {
          ...chartDataYear,
          labels: labels,
          datasets: [
            {
              ...chartDataYear.datasets[0],
              data: inflowData,
            },
            {
              ...chartDataYear.datasets[1],
              data: outflowData,
            },
          ],
        };

        console.log('year wise data: '+ updatedChartDataYear.datasets[0].data)

        setYear(false);
        setChartDataYear(updatedChartDataYear);
        
      
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };


  useEffect(() => {
    fetchTimeSeries();
  }, []);

  return (
    <div className="App">
      <div className="dropdown">
      <button onClick={handleOpen}>Currency Flow (Date/Year)</button>
      {open ? (
        <ul className="menu">
          <li className="menu-item">
            <button onClick={fetchTimeSeries} >Date Wise</button>
          </li>
          <li className="menu-item">
            <button onClick={fetchTimeSeriesYear} >Year Wise</button>
          </li>
        </ul>
      ) : null}
      {year ?   <Bar options={option} data={chartData}  className="bar"/>: <Bar options={option} data={chartDataYear} className="barYear"/>}
    </div>
      {/* <Bar options={option} data={chartData} className="bar"/>
      <Bar options={option} data={chartDataYear} className="barYear"/> */}

    </div>
  );
}
