import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const truncate = (str, max = 10) =>
  str.length > max ? str.substring(0, max) + "..." : str;

const LineChartComponent = ({ title, data, xKey = "type", yKey = "count" }) => (
  <>
    <h6 className="fw-bold mb-3">{title}</h6>
    <LineChart width={500} height={300} data={data} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey={xKey}
        tickFormatter={(value) => truncate(value, 12)} // shorten labels if too long
        interval={0} // show all labels
      />
      <YAxis />
      <Tooltip
        formatter={(value, name) => [value, name]}
        labelFormatter={(label) => label}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey={yKey}   // ✅ now it uses "count"
        stroke="#8884d8"
        strokeWidth={2}
      />
    </LineChart>
  </>
);

export default LineChartComponent;
