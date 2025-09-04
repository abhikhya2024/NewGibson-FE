import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const DEFAULT_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#413ea0"];
const truncate = (str, max = 5) =>
  str && str.length > max ? str.substring(0, max) + "..." : str;

const DonutChart = ({ 
  title, 
  data, 
  dataKey = "transcript_count",   // default is transcript_count
  nameKey = "case_name", 
  colors = DEFAULT_COLORS, 
  innerRadius = 55, 
  outerRadius = 90 
}) => (
  <>
    <h6 className="fw-bold mb-3">{title}</h6>
    <PieChart width={400} height={250}>
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        label={({ value }) => value} // ✅ show transcript_count on slice
      >
        {data?.map((_, idx) => (
          <Cell key={idx} fill={colors[idx % colors.length]} />
        ))}
      </Pie>

      <Tooltip 
        formatter={(value, name, props) => [
          value, 
          truncate(props.payload[nameKey], 5) // legend/tooltip shows truncated case_name
        ]} 
      />
      <Legend 
        formatter={(value, entry) => truncate(entry.payload[nameKey], 5)} 
      />
    </PieChart>
  </>
);

export default DonutChart;
