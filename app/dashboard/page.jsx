"use client";
import React, { useState } from "react";
import { FaArrowUp, FaChartLine, FaBoxes, FaClock, FaWeightHanging, FaLayerGroup, FaStopwatch, FaPause, FaCogs, FaIndustry, FaTools, FaWarehouse, FaCube } from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const PendingOrders = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const orderStats = [
    "No. of Orders Pending",
    "No. of PO Pending for placement",
    "No. of Coils available",
    "Gradewise Coil availability",
    "Average turnaround time of material ",
    "Average production time ",
    "Average tons/hr ",
    "Average tons/KW hr ",
    "Average rolling length per roll chart ",
    "Coils with residing time more than 1 month",
    "Coils Pending for supply",
    "Downtime (min)",
  ];

  const dummyMetrics = [
    45, 20, 66, "N/A", "2.3 hrs", "4.5 hrs", "15 tons/hr", "0.8 tons/KW hr", "1200 m", 8, 15, "45 min",
  ];

  const dummyBenchmarks = [
    40, 25, 50, "N/A", "2.5 hrs", "4.0 hrs", "12 tons/hr", "0.7 tons/KW hr", "1000 m", 10, 12, "50 min",
  ]; // Sample benchmarks for comparison

  const coilDataFront = [
    { grade: "E150BR", quantity: 12 },
    { grade: "E250BR", quantity: 10 },
  ];

  const coilDataBack = [
    ...coilDataFront,
    { grade: "E350BR", quantity: 11 },
    { grade: "API Y", quantity: 15 },
    { grade: "E450BR", quantity: 18 },
  ];

  const rollingCampaignData = [
    { no: "RC-001", coils: 50, weightage: "1200T", avgProductionTime: "5 hrs", grades: 3, cobles: 2, stoppages: 1, downtime: "15 min" },
    { no: "RC-002", coils: 45, weightage: "1100T", avgProductionTime: "4.8 hrs", grades: 2, cobles: 1, stoppages: 2, downtime: "25 min" },
    { no: "RC-003", coils: 60, weightage: "1350T", avgProductionTime: "6 hrs", grades: 4, cobles: 3, stoppages: 1, downtime: "10 min" },
  ];

  const icons = [
    <FaChartLine className="text-2xl" />, <FaBoxes className="text-2xl" />, <FaCube className="text-2xl" />, <FaWarehouse className="text-2xl" />,
    <FaClock className="text-2xl" />, <FaStopwatch className="text-2xl" />, <FaWeightHanging className="text-2xl" />, <FaCogs className="text-2xl" />,
    <FaTools className="text-2xl" />, <FaIndustry className="text-2xl" />, <FaLayerGroup className="text-2xl" />, <FaPause className="text-2xl" />,
  ];

  // Bar chart data with increase/decrease indication
  const barChartData = (value, benchmark, index) => {
    const isNumeric = typeof value === "number" && typeof benchmark === "number";
    const changePercentage = isNumeric ? ((value - benchmark) / benchmark * 100).toFixed(1) : 0;
    const isIncrease = changePercentage >= 0;

    return {
      labels: ["Current", "Benchmark"],
      datasets: [{
        label: "Value",
        data: [value, benchmark],
        backgroundColor: [isIncrease ? "rgba(34, 197, 94, 0.8)" : "rgba(239, 68, 68, 0.8)", "rgba(75, 85, 99, 0.5)"],
        borderColor: [isIncrease ? "rgba(34, 197, 94, 1)" : "rgba(239, 68, 68, 1)", "rgba(75, 85, 99, 1)"],
        borderWidth: 1,
      }],
      change: `${isIncrease ? "+" : ""}${changePercentage}%`,
      isIncrease,
    };
  };

  const barChartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, display: false },
      x: { display: true, ticks: { color: "#fff", font: { size: 10 } } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  // Sparkline data for Downtime
  const sparklineData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [{
      label: "Downtime",
      data: [30, 40, 25, 45, 15],
      borderColor: "rgba(34, 197, 94, 1)", // Green for decrease
      backgroundColor: "rgba(34, 197, 94, 0.2)",
      fill: true,
      tension: 0.4,
    }],
  };

  const sparklineOptions = {
    maintainAspectRatio: false,
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
  };

  return (
    <div className="min-h-screen  text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-7xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Pending Orders Dashboard
        </h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {orderStats.map((title, index) => {
            if (title === "Gradewise Coil availability") {
              return (
                <div
                  key={index}
                  className="relative w-full h-60 perspective cursor-pointer group"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div className={`card-container ${isFlipped ? "flipped" : ""} transition-transform duration-500`}>
                    {/* Front Side */}
                    <div className="card-front absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 bg-opacity-90 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between transform transition-all duration-300 group-hover:scale-105">
                      <div className="flex items-center space-x-3">
                        {icons[index]}
                        <h2 className="text-lg font-semibold">{title}</h2>
                      </div>
                      <div>
                        {coilDataFront.map((coil, i) => (
                          <p key={i} className="text-yellow-400 font-bold">
                            {coil.grade}: {coil.quantity}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center text-green-400 text-sm">
                        <FaArrowUp className="mr-1" /> 22% above benchmark
                      </div>
                    </div>

                    {/* Back Side */}
                    <div className="card-back absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 bg-opacity-90 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between transform transition-all duration-300 group-hover:scale-105">
                      <div className="flex items-center space-x-3">
                        {icons[index]}
                        <h2 className="text-lg font-semibold">{title}</h2>
                      </div>
                      <div>
                        {coilDataBack.map((coil, i) => (
                          <p key={i} className="text-yellow-400 font-bold">
                            {coil.grade}: {coil.quantity}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center text-green-400 text-sm">
                        <FaArrowUp className="mr-1" /> 22% above benchmark
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              const isNumeric = typeof dummyMetrics[index] === "number" && typeof dummyBenchmarks[index] === "number";
              const chartData = barChartData(dummyMetrics[index], dummyBenchmarks[index], index);
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800 to-gray-700 bg-opacity-90 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500 relative group"
                >
                  <div className="flex items-center space-x-3">
                    {icons[index]}
                    <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
                  </div>
                  <div className="mt-4 flex flex-col items-center space-y-2">
                    <p className="text-3xl font-extrabold text-yellow-400">{dummyMetrics[index]}</p>
                    {/* Larger Bar Chart */}
                    {isNumeric && (
                      <div className="w-full h-24">
                        <Bar data={chartData} options={barChartOptions} />
                      </div>
                    )}
                    {/* Sparkline for Downtime */}
                    {title === "Downtime (min)" && (
                      <div className="w-full h-24">
                        <Line data={sparklineData} options={sparklineOptions} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-sm mt-2 justify-between">
                    <span className={chartData.isIncrease ? "text-green-400" : "text-red-400"}>
                      {chartData.change}
                    </span>
                    <span className={chartData.isIncrease ? "text-green-400" : "text-red-400"}>
                      {chartData.isIncrease ? <FaArrowUp className="inline mr-1" /> : <FaArrowUp className="inline mr-1 rotate-180" />}
                      {isNumeric ? "vs benchmark" : "22% above benchmark"}
                    </span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute top-0 right-0 bg-gray-900 text-xs p-2 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {isNumeric ? `Benchmark: ${dummyBenchmarks[index]}` : "See details"}
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* Rolling Campaign Info Table */}
        <h2 className="text-2xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Rolling Campaign Info
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-gray-700 to-gray-600">
                <th className="p-3 text-left border border-gray-600 font-semibold">Rolling Campaign No.</th>
                <th className="p-3 text-left border border-gray-600 font-semibold">No. of Coils</th>
                <th className="p-3 text-left border border-gray-600 font-semibold">Weightage</th>
                <th className="p-3 text-left border border-gray-600 font-semibold">Avg. Production Time</th>
                <th className="p-3 text-left border border-gray-600 font-semibold">No. of Grades</th>
                <th className="p-3 text-left border border-gray-600 font-semibold">No. of Cobles</th>
                <th className="p-3 text-left border border-gray-600 font-semibold">No. of Stoppages</th>
                <th className="p-3 text-left border border-gray-600 font-semibold">Total Downtime</th>
              </tr>
            </thead>
            <tbody>
              {rollingCampaignData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-700 transition-colors">
                  <td className="p-3 border border-gray-600">{row.no}</td>
                  <td className="p-3 border border-gray-600">{row.coils}</td>
                  <td className="p-3 border border-gray-600">{row.weightage}</td>
                  <td className="p-3 border border-gray-600">{row.avgProductionTime}</td>
                  <td className="p-3 border border-gray-600">{row.grades}</td>
                  <td className="p-3 border border-gray-600">{row.cobles}</td>
                  <td className="p-3 border border-gray-600">{row.stoppages}</td>
                  <td className="p-3 border border-gray-600">{row.downtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;