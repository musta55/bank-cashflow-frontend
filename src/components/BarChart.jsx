import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import RadioButton from "./RadioButton";
import "./Chart.css";

Chart.register(...registerables);

const API_ENDPOINT = "http://localhost:5000/api/v1/timeSeries/";

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

export default function BarChart() {
  const [open, setOpen] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [year, setYear] = useState(false);

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
    setOpen(!open);
  };

  // Date wise data
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

  // Year wise data
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

  // LineChart
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

  const fetchTimeSeries = (branch) => {
    console.log("api holo " + API_ENDPOINT + "/" + branch);
    fetch(API_ENDPOINT + branch)
      .then((response) => response.json())
      .then((fetchedData) => {
        let labels = fetchedData.map((data) => data.Date);
        let inflowData = fetchedData.map((data) => data.INFLOW);
        let outflowData = fetchedData.map((data) => data.OUTFLOW);

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
        console.log("updates " + Object.keys(updatedChartData.datasets[0]));
        setChartData(updatedChartData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function FetchDate() {
    return <Bar options={option} data={chartData} className="bar" />;
  }

  function FetchYear() {
    return <Bar options={option} data={chartDataYear} className="barYear" />;
  }

  function FetchLineChart() {
    return <Line options={option} data={chartData} className="line" />;
  }

  function FetchLineChartYear() {
    return <Line options={option} data={chartDataYear} className="line" />;
  }

  const fetchTimeSeriesYear = (branch) => {
    fetch("http://localhost:5000/api/v1/timeSeries/year/" + branch)
      .then((response) => response.json())
      .then((fetchedData) => {
        let labels = fetchedData.map((data) => data.year);
        let inflowData = fetchedData.map((data) => data.inflow);
        let outflowData = fetchedData.map((data) => data.outflow);

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

        console.log("year wise data: " + updatedChartDataYear.datasets[0].data);
        setChartDataYear(updatedChartDataYear);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // useEffect(() => {
  //  // fetchTimeSeries();
  // }, []);

  return (
    <div className="BarChart">
      <div className="dropdown">
        <button onClick={handleOpen}>Currency Flow (Date/Year)</button>
        {open ? (
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

            {showDiv && year && (
              <div>
                {/* Year-wise div content */}
                <div>
                  <button
                    label="Dhaka Branch"
                    onClick={() => {
                      fetchTimeSeriesYear("dhaka");

                    }}
                  >
                    Dhaka Branch
                  </button>
                  <button
                    label="Chittagong Branch"
                    onClick={() => {
                      fetchTimeSeriesYear("chittagong");
                    }}
                  >
                    Chittagong Branch
                  </button>
                  <button
                    label="Sylhet Branch"
                    onClick={() => {
                      fetchTimeSeriesYear("sylhet");
                    }}
                  >
                    Sylhet Branch
                  </button>
                  <button
                    label="Rangpur Branch"
                    onClick={() => {
                      fetchTimeSeriesYear("rangpur");
                    }}
                  >
                    Rangpur Branch
                  </button>
                </div>
                <FetchYear />
                <FetchLineChartYear />
              </div>
            )}
            {showDiv && !year && (
              <div>
                {/* Date-wise div content */}
                <div>
                  <button
                    label="Dhaka Branch"
                    onClick={() => {
                      fetchTimeSeries("dhaka");
                    }}
                  >
                    Dhaka Branch 
                  </button>
                  <button
                    label="Chittagong Branch"
                    onClick={() => {
                      fetchTimeSeries("chittagong");
                    }}
                  >
                    Chittagong Branch 
                  </button>
                  <button
                    label="Sylhet Branch"
                    onClick={() => {
                      fetchTimeSeries("sylhet");
                    }}
                  >
                    Sylhet Branch 
                  </button>
                  <button
                    label="Rangpur Branch "
                    onClick={() => {
                      fetchTimeSeries("rangpur");
                    }}
                  >
                    Rangpur Branch 
                  </button>
                </div>
                <FetchDate /> 
                <FetchLineChart/>
              </div>
            )}
          </div>
        ) : null}
        {/* {year ? <FetchDate /> : <FetchYear />} */}
      </div>

    </div>
  );
}
