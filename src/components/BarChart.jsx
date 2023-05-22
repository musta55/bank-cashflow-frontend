import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import RadioButton from "./RadioButton";
import "./Chart.css";
import { fetchBarService, fetchBarYearService } from "../services/apiService";

Chart.register(...registerables);

const option = {
  responsive: true,
  type: "scale",
  plugins: {
    legend: { position: "chartArea" },
    title: {
      display: true,
      text: "Currency Flow",
    },
  },
};

const BarChart = () => {
  const [open, setOpen] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [year, setYear] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "RECEIVED",
        data: [],
        backgroundColor: "#8150C3",
      },
      {
        label: "PAYMENT",
        data: [],
        backgroundColor: "#5ECAC7",
      },
    ],
  });

  const [chartDataYear, setChartDataYear] = useState({
    labels: [],
    datasets: [
      {
        label: "RECEIVED",
        data: [],
        backgroundColor: "#8150C3",
      },
      {
        label: "PAYMENT",
        data: [],
        backgroundColor: "#5ECAC7",
      },
    ],
  });

  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Line Chart",
        data: [],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
    ],
  });

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "year") {
      setShowDiv(true);
      setYear(true);
    } else if (selectedValue === "date") {
      setShowDiv(true);
      setYear(false);
    }
  };

  const handleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const fetchData = (branch) => {
    fetchBarService(branch)
      .then((fetchedData) => {
        let labels = fetchedData.map((data) => data.date);
        let inflowData = fetchedData.map((data) => data.inflow);
        let outflowData = fetchedData.map((data) => data.outflow);

        const updatedChartData = {
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

        setChartData(updatedChartData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchDataYear = (branch) => {
    fetchBarYearService(branch)
      .then((fetchedData) => {
        let labels = fetchedData.map((data) => data.year);
        let inflowData = fetchedData.map((data) => data.inflow);
        let outflowData = fetchedData.map((data) => data.outflow);

        const updatedChartDataYear = {
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

        setChartDataYear(updatedChartDataYear);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (showDiv && year) {
      fetchDataYear("dhaka");
    } else if (showDiv && !year) {
      fetchData("dhaka");
    }
  }, [showDiv, year]);

  const BarChartComponent = ({ data, className }) => {
    return <Bar options={option} data={data} className={className} />;
  };

  const LineChartComponent = ({ data, className }) => {
    return <Line options={option} data={data} className={className} />;
  };

  return (
    <div className="BarChart">
      <h1>Cash Flow Analysis</h1>
      <div className="dropdown">
        <button onClick={handleOpen}>Currency Flow (Date/Year)</button>
        {open && (
          <div>
            <label>
              <input
                type="radio"
                value="year"
                checked={showDiv && year}
                onChange={handleRadioChange}
              />
              Year
            </label>
            <label>
              <input
                type="radio"
                value="date"
                checked={showDiv && !year}
                onChange={handleRadioChange}
              />
              Date
            </label>

            {showDiv && (
              <div>
                <div>
                  <button
                    label="Dhaka Branch"
                    onClick={() => {
                      year ? fetchDataYear("dhaka") : fetchData("dhaka");
                    }}
                  >
                    Dhaka Branch
                  </button>
                  <button
                    label="Chittagong Branch"
                    onClick={() => {
                      year ? fetchDataYear("chittagong") : fetchData("chittagong");
                    }}
                  >
                    Chittagong Branch
                  </button>
                  <button
                    label="Sylhet Branch"
                    onClick={() => {
                      year ? fetchDataYear("sylhet") : fetchData("sylhet");
                    }}
                  >
                    Sylhet Branch
                  </button>
                  <button
                    label="Rangpur Branch"
                    onClick={() => {
                      year ? fetchDataYear("rangpur") : fetchData("rangpur");
                    }}
                  >
                    Rangpur Branch
                  </button>
                </div>
                {year ? (
                  <>
                    <BarChartComponent data={chartDataYear} className="barYear" />
                    <LineChartComponent data={chartDataYear} className="line" />
                  </>
                ) : (
                  <>
                    <BarChartComponent data={chartData} className="bar" />
                    <LineChartComponent data={chartData} className="line" />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarChart;
