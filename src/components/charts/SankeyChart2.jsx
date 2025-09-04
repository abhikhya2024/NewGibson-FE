// AttorneyFirmSankeyChart.jsx
import React, { useEffect, useState, useMemo } from "react";
import { ResponsiveContainer, Sankey, Tooltip } from "recharts";

// Fallback data in case API fails
const samplePairs = [
  { attorney: "Emily Clark", firm: "Smith & Associates" },
  { attorney: "James Patel", firm: "Smith & Associates" },
  { attorney: "Rita Gomez", firm: "Johnson & Partners" },
  { attorney: "Leo Park", firm: "Johnson & Partners" },
  { attorney: "Ava Shah", firm: "Williams & Co" },
];

// Build nodes and links for Sankey
function buildSankeyData(pairs) {
  const attorneys = [...new Set(pairs.map(p => p.attorney))];
  const firms = [...new Set(pairs.map(p => p.firm))];

  const nodes = [
    ...attorneys.map(name => ({ name, group: "attorney" })),
    ...firms.map(name => ({ name, group: "firm" })),
  ];

  const indexByName = new Map(nodes.map((n, i) => [n.name, i]));

  const links = pairs.map(p => ({
    source: indexByName.get(p.attorney),
    target: indexByName.get(p.firm),
    value: 1,
    sourceName: p.attorney, // attach names for tooltip
    targetName: p.firm,
  }));

  return { nodes, links, attorneyCount: attorneys.length };
}

// Custom node rendering
const Node = ({ x, y, width, height, payload }) => {
  const isFirm = payload.group === "firm";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={3}
        fill={isFirm ? "#82ca9d" : "#8884d8"}
        stroke="#333"
        strokeWidth={1}
      />
      <text
        x={isFirm ? x + width + 8 : x - 8}
        y={y + height / 2}
        textAnchor={isFirm ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        style={{ pointerEvents: "none", backgroundColor: "pink" }}

      >
        {payload.name}
      </text>
    </g>
  );
};

// Custom link rendering for thicker Sankey lines
const CustomLink = ({ sourceX, sourceY, targetX, targetY, width }) => {
  const path = `M${sourceX},${sourceY}C${(sourceX + targetX) / 2},${sourceY} 
                ${(sourceX + targetX) / 2},${targetY} ${targetX},${targetY}`;
  return (
    <path
      d={path}
      stroke="#8884d8"
      strokeOpacity={0.7}
      strokeWidth={Math.max(width * 4, 4)}
      fill="none"
    />
  );
};

export default function AttorneyFirmSankeyChart() {
  const [attByFirm, setAttByFirm] = useState([]);

  useEffect(() => {
    const fetchAttByFirm = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_PROD_API_URL}/api/witness/`);
        const data = await res.json();

        if (Array.isArray(data.transcripts_by_witness) && data.transcripts_by_witness.length > 0) {
          // Map API response to {attorney, firm} pairs
          const pairs = data.transcripts_by_witness.map(a => ({
            attorney: a.witness,
            firm: a.transcript|| "Unknown Firm",
          }));
          setAttByFirm(pairs);
        } else {
          setAttByFirm(samplePairs);
        }
      } catch (err) {
        console.error(err.message);
        setAttByFirm(samplePairs);
      }
    };

    fetchAttByFirm();
  }, []);

  // Compute Sankey nodes/links after data is ready
  const { nodes, links, attorneyCount } = useMemo(
    () => buildSankeyData(attByFirm.length > 0 ? attByFirm : samplePairs),
    [attByFirm]
  );

  const height = Math.max(420, attorneyCount * 28);

  return (
    <div style={{ width: "100%", paddingBottom: "30px", height: "438px"}}>
      <p className="fw-bold">Attorneys and their affiliated law firms</p>

      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={{ nodes, links }}
          nodeWidth={14}
          nodePadding={22}
          iterations={64}
          margin={{ left: 160, right: 300, top: 20, bottom: 20 }}
          node={<Node />}
          link={<CustomLink />}
        >
          {/* <Tooltip
            content={({ payload }) => {
              if (!payload || !payload.length) return null;
              const link = payload[0].payload; // link object
              return (
                <div
                  style={{
                    background: "#fff",
                    padding: "5px 8px",
                    border: "1px solid #ccc",
                  }}
                >
                  {link.sourceName} → {link.targetName}
                </div>
              );
            }}
          /> */}
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
}
