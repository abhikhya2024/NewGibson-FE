// FirmDepositionsChart.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Fallback sample data in correct format
const sampleData = [
  { law_firm: "Shook, Hardy & Bacon", file_count: 26 },
  { law_firm: "Jones Day", file_count: 6 },
  { law_firm: "Gordon & Partners", file_count: 24 },
  { law_firm: "Dolan Dobrinsky Rosenblum Bluestein", file_count: 2 },
];

export default function FirmDepositionsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDepositionCounts = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_PROD_API_URL}/api/attorney/`
        );
        const json = await res.json();

          setData(json.file_counts_by_law_firm);

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchDepositionCounts();
  }, []);

  const CustomXAxisTick = ({ x, y, payload, width }) => {
    const maxCharsPerLine = 12; // tweak this based on chart width
    const words = payload.value.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine.trim());
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine.trim());

    return (
      <g transform={`translate(${x},${y + 10})`}>
        {lines.map((line, index) => (
          <text
            key={index}
            x={0}
            y={index * 14}
            textAnchor="middle"
            fontSize={12}
          >
            {line}
          </text>
        ))}
      </g>
    );
  };
  return (
    <div style={{ width: "100%", height: 440 }}>
      <p className="fw-bold">Deposition Count by Firm</p>

      <ResponsiveContainer width="100%" height={370}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="law_firm"
            interval={0}
            height={100}
            tick={<CustomXAxisTick />}
            label={{
              value: "Law Firm",
              position: "insideBottom",
              fontSize: 14,
              style: {
                fontSize: 14,
                fontWeight: "bold",
                fill: "black", // ✅ makes it black
              },
            }}
          />
          <YAxis
            label={{
              value: "Deposition Count",
              angle: -90,
              position: "insideLeft", // position inside the left side
              offset: 5, // increase offset to push label left (default is smaller)
              style: {
                fontSize: 14,
                fontWeight: "bold",
                fill: "black",
              },
            }}
          />
          <Tooltip formatter={(value) => [value, "Depositions"]} />
          <Bar dataKey="file_count" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#82ca9d" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
