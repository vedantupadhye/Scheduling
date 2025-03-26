// "use client";

// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const data = [
//   { leastProductionDate: "2024-03-01", gradeA: 30, gradeB: 20, gradeC: 10 },
//   { leastProductionDate: "2024-03-02", gradeA: 40, gradeB: 15, gradeC: 25 },
//   { leastProductionDate: "2024-03-03", gradeA: 25, gradeB: 30, gradeC: 20 },
// ];

// const StackedBarChart = () => {
//   return (
//     <div className="w-full h-96">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//           <XAxis dataKey="leastProductionDate" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="gradeA" stackId="a" fill="#8884d8" />
//           <Bar dataKey="gradeB" stackId="a" fill="#82ca9d" />
//           <Bar dataKey="gradeC" stackId="a" fill="#ffc658" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default StackedBarChart;

"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const StackedBarChart = ({ data }) => {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="leastProductionDate" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="A" stackId="a" fill="#8884d8" />
          <Bar dataKey="B" stackId="a" fill="#82ca9d" />
          <Bar dataKey="C" stackId="a" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
