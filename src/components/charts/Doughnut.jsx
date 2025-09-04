import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Row, Col } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function WitnessDoughnut() {
  const [witnessTypeCnt, setWitnessTypeCnt] = useState([]);
  const [testimonyCnt, setTestimonyCnt] = useState([]);

  const fetchWitness = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/witness/`
      );
      const data = await res.json();
      setWitnessTypeCnt(Array.isArray(data.type_counts) ? data.type_counts : []);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchTestimonyCnt = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/testimony/testimony-cnt-by-transcripts/`
      );
      const data = await res.json();
      // API returns an array directly
      setTestimonyCnt(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchWitness();
    fetchTestimonyCnt();
  }, []);

  // Witness chart
  const totalWitnessTypeCount = witnessTypeCnt.reduce(
    (sum, type) => sum + (type.count || 0),
    0
  );

  const witnessTypeData = {
    labels: witnessTypeCnt.map((type) => {
      const count = type.count || 0;
      const percentage =
        totalWitnessTypeCount > 0
          ? ((count / totalWitnessTypeCount) * 100).toFixed(1)
          : 0;
      return `${type.type__type || "Unknown"} (${percentage}%)`;
    }),
    datasets: [
      {
        label: "Witness Count",
        data: witnessTypeCnt.map((type) => type.count || 0),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Testimony chart
  const totalTestimonyCount = testimonyCnt.reduce(
    (sum, t) => sum + (t.testimony_count || 0),
    0
  );

  const testimonyData = {
    labels: testimonyCnt.map((t) => {
      const count = t.testimony_count || 0;
      const percentage =
        totalTestimonyCount > 0
          ? ((count / totalTestimonyCount) * 100).toFixed(1)
          : 0;
      return `${t.name || "Unknown"} (${percentage}%)`;
    }),
    datasets: [
      {
        label: "Testimony Count",
        data: testimonyCnt.map((t) => t.testimony_count || 0),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6347",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
        <p className="fw-bold">Witness types ratio</p>
        {witnessTypeCnt.length > 0 ? (
<div style={{ width: "250px", height: "400px", margin: "0 auto" }}>
  <Doughnut
    data={witnessTypeData}
    options={{
      responsive: true,
      maintainAspectRatio: false, // respects container height/width
      plugins: {
        legend: {
          position: "bottom",
          labels: { font: { size: 12 } },
        },
      },
    }}
  />
</div>        ) : (
          <p>Loading witness chart...</p>
        )}
      </>
    );
}
