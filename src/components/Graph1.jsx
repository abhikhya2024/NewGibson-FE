// src/components/GraphsAndAnalysis.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", Done: 60, Task: 50, Goal: 40 },
  { name: "Feb", Done: 90, Task: 70, Goal: 50 },
  { name: "Mar", Done: 137, Task: 123, Goal: 84 },
  { name: "Apr", Done: 40, Task: 30, Goal: 25 },
  { name: "Mei", Done: 137, Task: 123, Goal: 84 }, // Highlight Month
  { name: "Jun", Done: 60, Task: 50, Goal: 30 },
  { name: "Jul", Done: 45, Task: 35, Goal: 20 },
  { name: "Aug", Done: 67, Task: 56, Goal: 45 },
  { name: "Sep", Done: 88, Task: 75, Goal: 60 },
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#1a1a2e",
          borderRadius: 10,
          padding: 10,
          color: "#fff",
        }}
      >
        <p>{label}</p>
        <p>🔹 Project Done: {payload[0].value}</p>
        <p>🔹 Project Task: {payload[1].value}</p>
        <p>🔹 Project Goal: {payload[2].value}</p>
      </div>
    );
  }
  return null;
};


const Graphs1 = () => {
  return (
    <div className="graph1-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <div className="label-icon-sorath bg-primary bg-gradient border-0">
            <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 388.6 330.01"
              fill="#fff"
            >
              <title>graph</title>
              <path
                d="M227,503.11c2-6.2,6.32-10.7,10.83-15.18q37.54-37.32,74.95-74.81c10.44-10.43,21.25-10.41,31.73.06q28.19,28.17,56.34,56.37a19.1,19.1,0,0,1,2.2,3.14L541,335.11c-3.35-3.23-6.89-6.59-10.38-10q-3.93-3.86-7.72-7.84c-3.45-3.63-5.24-7.68-3.23-12.75s5.86-7.5,11.09-7.78q22.92-1.26,45.85-2.33c7.71-.38,15.42-.7,23.13-1,11.43-.46,16.35,4.15,15.88,15.46-.9,21.86-1.9,43.72-3.18,65.57a19.67,19.67,0,0,1-3.44,9.76c-4.44,6.24-11.59,7-17.05,1.72-6.37-6.14-12.17-12.86-18.5-19.64-2,1.87-3,2.85-4.06,3.88L419.58,519.88c-8,8-17.31,9.67-25.7,4.47a33.41,33.41,0,0,1-5.79-4.85q-28.23-28.14-56.38-56.34c-1-1-2-1.88-3.15-3-1.16,1.1-2.16,2-3.13,3-19.51,19.5-39.43,38.6-58.39,58.61-15.74,16.62-33.76,5.15-39.22-9.45a15.39,15.39,0,0,0-.82-1.62Z"
                transform="translate(-227 -293.35)"
              />
              <path
                d="M572.28,400.26c4.42,2.11,5,5.48,5,9.59q-.15,101.08-.08,202.17c0,1.52,0,3-.1,4.55-.36,3.93-2.58,6.54-6.47,6.58q-24.65.26-49.3,0c-4.11,0-6.38-2.69-6.7-6.77-.09-1.14-.07-2.28-.07-3.42q0-75.48-.07-151a9.31,9.31,0,0,1,3.07-7.24q26.13-25.89,52.07-52C570.48,401.92,571.4,401.08,572.28,400.26Z"
                transform="translate(-227 -293.35)"
              />
              <path
                d="M490.26,482.42V612.88c0,8.37-2.12,10.46-10.59,10.46q-21.26,0-42.51,0c-7.5,0-9.74-2.27-9.75-9.72,0-22.14,0-44.28-.05-66.42,0-2.53.64-4.16,2.8-5.6a43.42,43.42,0,0,0,6.23-5.53q25.13-25.05,50.2-50.16C487.55,485,488.55,484,490.26,482.42Z"
                transform="translate(-227 -293.35)"
              />
              <path
                d="M340.51,505.1c1.4,1.27,2.32,2,3.16,2.89,9.31,9.29,18.71,18.49,27.87,27.93,8.15,8.4,17.64,13.79,29.5,14.54a13.78,13.78,0,0,1,2.09.51v8.32q0,27.32,0,54.62c0,7-2.3,9.4-9.25,9.42q-22.19.06-44.38,0c-6.65,0-9.15-2.51-9.16-9.19q0-52.9,0-105.82C340.34,507.48,340.42,506.65,340.51,505.1Z"
                transform="translate(-227 -293.35)"
              />
              <path
                d="M253.42,553.25c13.08-1.07,22.76-7.45,31.3-16.27,10-10.34,20.3-20.4,31.07-31.17.13,1.92.27,3.09.27,4.26q0,51.81,0,103.62c0,7.46-2.22,9.64-9.77,9.65q-21.63,0-43.27,0c-7.35,0-9.6-2.21-9.6-9.4q0-28.47,0-56.93Z"
                transform="translate(-227 -293.35)"
              />
            </svg>
          </div>
          <div className="mb-0 ms-3">
            <h5 className="mb-0 fw-semibold">Graphs and Analysis</h5>
            <small className="text-muted">
              Projects completed per month based on trends.
            </small>
          </div>
        </div>

        <select className="month-dropdown-sorath w-auto">
          <option>Month</option>
          <option>Quarter</option>
        </select>

        <div className="text-secondary icon-header">
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 383.34 359.37"><title>download</title><path d="M340,409.39c.67-3.27,1.27-6.55,2-9.79,8.68-38,40.93-64.59,79.75-65.8.85,0,1.7-.13,2.51-.19a108.47,108.47,0,0,1,107-95.65c55.36-.18,101.53,41.74,107.61,94.63,9.36,1.93,18.74,3,27.51,5.83,35.9,11.73,59.72,47.81,56.7,85-3.14,38.8-31.23,70.1-68.9,76.65a84.72,84.72,0,0,1-13.75,1.35c-20.08.15-40.16.12-60.25.05-9.6,0-15.5-9.17-11.28-17.35,2.42-4.69,6.47-6.61,11.68-6.6q29.19.07,58.38,0c29.25-.1,53.29-19.81,59.23-48.45,7.37-35.56-20.5-70.53-56.81-71.27-4-.08-8,0-12,0-9.22,0-13.79-4.51-14-13.68a83.83,83.83,0,0,0-167.63.28c-.17,8.75-4.8,13.45-13.49,13.37-11-.09-21.91,0-32.4,4.16-24.87,10-40.86,35.92-37.72,61.53,3.49,28.48,24.09,49.83,51.81,53.46a107.37,107.37,0,0,0,13.43.62c17.46.06,34.92,0,52.39,0,8.33,0,13.8,4.7,13.85,11.87s-5.43,12.07-13.66,12.07c-19.21,0-38.42.06-57.63,0-43.05-.15-77.91-30.81-83.71-73.51a27.54,27.54,0,0,0-.68-2.82Z" transform="translate(-340 -237.96)"/><path d="M519.65,555.36v-4q0-71.46,0-142.9a29,29,0,0,1,.17-4.85,12,12,0,0,1,23.73,1.27c.1,1.37,0,2.74,0,4.12V556c1.2-1,2-1.61,2.7-2.31q11.93-11.9,23.82-23.8c5.64-5.61,12.88-5.95,17.89-.91s4.61,12.22-1,17.9q-22.85,22.9-45.76,45.76c-6.32,6.3-12.88,6.25-19.23-.1q-23.16-23.13-46.28-46.31c-7-7-4.16-18.06,5.11-20.42,4.64-1.18,8.57.28,11.91,3.63,7.83,7.86,15.7,15.69,23.52,23.56a30.29,30.29,0,0,1,2.32,2.94Z" transform="translate(-340 -237.96)"/></svg>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barGap={4}>
        <defs>
          {/* Default gradients */}
          <linearGradient id="defaultBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3366FF" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#33CCFF" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="defaultPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8e44ad" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#9b59b6" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="defaultGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2ecc71" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#27ae60" stopOpacity={0.7} />
          </linearGradient>

          {/* Active gradient */}
          <linearGradient id="hoverBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3366FF" />
            <stop offset="100%" stopColor="#33CCFF" />
          </linearGradient>
          <linearGradient id="hoverPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8e44ad" />
            <stop offset="100%" stopColor="#9b59b6" />
          </linearGradient>
          <linearGradient id="hoverGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2ecc71" />
            <stop offset="100%" stopColor="#27ae60" />
          </linearGradient>
        </defs>

        <XAxis dataKey="name" />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

        {/* Bars */}
        <Bar
          dataKey="Done"
          fill="url(#defaultBlue)"
          activeBar={{
            fill: "url(#hoverBlue)",
            style: {
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
            },
          }}
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="Task"
          fill="url(#defaultPurple)"
          activeBar={{
            fill: "url(#hoverPurple)",
            style: {
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
            },
          }}
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="Goal"
          fill="url(#defaultGreen)"
          activeBar={{
            fill: "url(#hoverGreen)",
            style: {
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
            },
          }}
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default Graphs1;
