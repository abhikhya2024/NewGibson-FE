import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const truncate = (str, max = 5) =>
  str && str.length > max ? str.substring(0, max) + "..." : str;

const BarChartComponent = ({ title, data, dataKey, xKey = "case_name" }) => {
  // Ensure dataKey is always an array
  const keys = Array.isArray(dataKey) ? dataKey : [dataKey];

  return (
    <>
      <h6 className="fw-bold mb-3 pb-5">{title}</h6>
      <BarChart width={400} height={250} data={data} margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xKey}
          tickFormatter={(value) => truncate(value, 5)} // 👈 truncate to 5 chars
          interval={0}
        />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [value, name]}
          labelFormatter={(label) => label} // 👈 full case_name in tooltip
        />
        <Legend />
        {keys.map((key, idx) => (
          <Bar
            key={key}
            dataKey={key}
            fill={idx % 2 === 0 ? "#8884d8" : "#82ca9d"}
          />
        ))}
      </BarChart>
    </>
  );
};

export default BarChartComponent;
