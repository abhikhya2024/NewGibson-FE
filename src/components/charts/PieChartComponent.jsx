import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const DEFAULT_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#413ea0"];
const truncate = (str, max = 5) =>
  str && str.length > max ? str.substring(0, max) + "..." : str;

const PieChartComponent = ({ 
  title, 
  data, 
  dataKey = "count",   // default to transcript_count
  nameKey, 
  colors = DEFAULT_COLORS 
}) => (
  <>
    <h6 className="fw-bold mb-3">{title}</h6>
    <PieChart width={400} height={250}>
      <Pie
        data={data}
        dataKey={dataKey}    // <-- transcript_count will be used as slice size
        nameKey={nameKey}    
        cx="50%"
        cy="50%"
        outerRadius={90}
        label={({ payload, value }) => `(${value})`}  
        // label now shows truncated case_name + transcript_count
      >
        {data?.map((_, idx) => (
          <Cell key={idx} fill={colors[idx % colors.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name, props) => [`${value}`, props.payload[nameKey]]} 
        // tooltip shows full case_name + transcript_count
      />
      <Legend
        formatter={(value, entry) => `${truncate(entry.payload[nameKey], 15)} (${entry.payload[dataKey]})`}  
        // legend shows truncated case_name + transcript_count
      />
    </PieChart>
  </>
);

export default PieChartComponent;
