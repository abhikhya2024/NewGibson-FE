import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#413ea0", "#00C49F"];

const truncate = (str, max = 10) =>
  str && str.length > max ? str.substring(0, max) + "..." : str;

const AreaChartComponent = ({ title, data, dataKey, xKey = "case_name" }) => (
  <>
    <h6 className="fw-bold mb-3">{title}</h6>
    <AreaChart
      width={400}
      height={250}
      data={data}
      margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey={xKey}
        tickFormatter={(value) => truncate(value, 5)} // truncate long case names
        interval={0}
      />
      <YAxis />
      <Tooltip
        formatter={(value, name) => [value, name]}
        labelFormatter={(label) => label} // show full case_name in tooltip
      />
      <Legend />
      <Area
        type="monotone"
        dataKey={dataKey}
        stroke={COLORS[0]}
        fill={COLORS[0]}
        fillOpacity={0.35}
      />
    </AreaChart>
  </>
);

export default AreaChartComponent;
