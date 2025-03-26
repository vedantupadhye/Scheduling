// // components/StackedBarChartServer.jsx
// "use client";
// import { useState, useEffect } from "react";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { getOrders } from "../actions/orders";

// export default function StackedBarChartServer() {
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchChartData() {
//       try {
//         // Use the existing server action instead of fetch
//         const orders = await getOrders();
        
//         // Process data for the chart
//         const aggregatedData = processOrdersForChart(orders);
//         setChartData(aggregatedData);
//       } catch (err) {
//         console.error('Error fetching chart data:', err);
//         setError('Failed to load chart data');
//       } finally {
//         setLoading(false);
//       }
//     }
    
//     fetchChartData();
//   }, []);

//   const processOrdersForChart = (orders) => {
//     // Group orders by date and grade
//     const dataByDate = {};
    
//     orders.forEach(order => {
//       // Skip orders without leastProductionDate
//       if (!order.leastProductionDate) return;
      
//       const date = new Date(order.leastProductionDate).toLocaleDateString();
      
//       if (!dataByDate[date]) {
//         dataByDate[date] = {
//           date,
//         };
//       }
      
//       // If this grade doesn't exist yet for this date, initialize it
//       if (!dataByDate[date][order.grade]) {
//         dataByDate[date][order.grade] = 0;
//       }
      
//       // Add the quantity to the appropriate grade
//       dataByDate[date][order.grade] += order.quantity;
//     });
    
//     // Convert to array format for Recharts
//     return Object.values(dataByDate);
//   };

//   // Get unique grades from the data for coloring
//   const getUniqueGrades = () => {
//     const grades = new Set();
//     chartData.forEach(dateData => {
//       Object.keys(dateData).forEach(key => {
//         if (key !== 'date') {
//           grades.add(key);
//         }
//       });
//     });
//     return Array.from(grades);
//   };

//   // Generate colors for each grade
//   const getColorForGrade = (grade, index) => {
//     const colors = [
//       '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', 
//       '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
//     ];
//     return colors[index % colors.length];
//   };

//   if (loading) return <div className="text-center py-8">Loading chart data...</div>;
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
//   if (chartData.length === 0) return <div className="text-center py-8">No data available for chart</div>;

//   const uniqueGrades = getUniqueGrades();

//   return (
//     <div className="mt-8">
//       <h2 className="text-xl font-bold mb-4">Coil Production by Grade</h2>
//       <div className="w-full h-96">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={chartData}
//             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis label={{ value: 'Quantity (Number of Coils)', angle: -90, position: 'insideLeft' }} />
//             <Tooltip />
//             <Legend />
//             {uniqueGrades.map((grade, index) => (
//               <Bar 
//                 key={grade}
//                 dataKey={grade} 
//                 stackId="a" 
//                 fill={getColorForGrade(grade, index)} 
//                 name={`Grade: ${grade}`} 
//               />
//             ))}
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }



// components/StackedBarChartServer.jsx
"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getOrders } from "../actions/orders";

export default function StackedBarChartServer() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayMetric, setDisplayMetric] = useState("quantity"); // "quantity" or "tons"

  useEffect(() => {
    async function fetchChartData() {
      try {
        // Use the existing server action instead of fetch
        const orders = await getOrders();
        
        // Process data for the chart
        const aggregatedData = processOrdersForChart(orders);
        setChartData(aggregatedData);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchChartData();
  }, []);

  const processOrdersForChart = (orders) => {
    // Group orders by date and grade
    const dataByDate = {};
    
    orders.forEach(order => {
      // Skip orders without leastProductionDate
      if (!order.leastProductionDate) return;
      
      const date = new Date(order.leastProductionDate).toLocaleDateString();
      
      if (!dataByDate[date]) {
        dataByDate[date] = {
          date,
        };
      }
      
      // Calculate weight in tons (weight * quantity)
      const tons = order.weight * order.quantity;
      
      // For each grade, store both quantity and tons
      const gradeQuantityKey = `quantity_${order.grade}`;
      const gradeTonsKey = `tons_${order.grade}`;
      
      // Initialize if not exists
      if (!dataByDate[date][gradeQuantityKey]) {
        dataByDate[date][gradeQuantityKey] = 0;
      }
      if (!dataByDate[date][gradeTonsKey]) {
        dataByDate[date][gradeTonsKey] = 0;
      }
      
      // Add the values
      dataByDate[date][gradeQuantityKey] += order.quantity;
      dataByDate[date][gradeTonsKey] += tons;
      
      // Also store the grade name for later reference
      if (!dataByDate[date].grades) {
        dataByDate[date].grades = new Set();
      }
      dataByDate[date].grades.add(order.grade);
    });
    
    // Convert to array format for Recharts and finalize the data structure
    return Object.values(dataByDate).map(dateEntry => {
      const finalEntry = { date: dateEntry.date };
      
      // If grades exists in the entry (meaning it has data)
      if (dateEntry.grades) {
        dateEntry.grades.forEach(grade => {
          // Store both metrics with proper keys
          finalEntry[grade] = dateEntry[`quantity_${grade}`];
          finalEntry[`tons_${grade}`] = dateEntry[`tons_${grade}`];
        });
      }
      
      return finalEntry;
    });
  };

  // Get unique grades from the data for coloring
  const getUniqueGrades = () => {
    const grades = new Set();
    chartData.forEach(dateData => {
      Object.keys(dateData).forEach(key => {
        // Original non-prefixed grade keys
        if (key !== 'date' && !key.startsWith('quantity_') && !key.startsWith('tons_')) {
          grades.add(key);
        }
      });
    });
    return Array.from(grades);
  };

  // Generate colors for each grade
  const getColorForGrade = (grade, index) => {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', 
      '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
    ];
    return colors[index % colors.length];
  };

  if (loading) return <div className="text-center py-8">Loading chart data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (chartData.length === 0) return <div className="text-center py-8">No data available for chart</div>;

  const uniqueGrades = getUniqueGrades();

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Coil Production by Grade</h2>
        <div className="flex items-center space-x-4">
          <span>Display:</span>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
                displayMetric === 'quantity' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setDisplayMetric('quantity')}
            >
              Quantity (Coils)
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${
                displayMetric === 'tons' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setDisplayMetric('tons')}
            >
              Weight (Tons)
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              label={{ 
                value: displayMetric === 'quantity' ? 'Quantity (Number of Coils)' : 'Weight (Tons)', 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip 
              formatter={(value, name) => {
                // Format the value based on the current display metric
                return [
                  displayMetric === 'quantity' 
                    ? `${value} coils` 
                    : `${value.toLocaleString()} tons`,
                  `Grade: ${name}`
                ];
              }}
            />
            <Legend />
            {uniqueGrades.map((grade, index) => (
              <Bar 
                key={grade}
                dataKey={displayMetric === 'quantity' ? grade : `tons_${grade}`}
                stackId="a" 
                fill={getColorForGrade(grade, index)} 
                name={grade} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}