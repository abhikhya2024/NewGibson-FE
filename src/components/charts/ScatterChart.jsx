import React, { useEffect, useState } from "react";
import * as d3 from "d3";

export default function TestimonyScatterChart() {
  const [chartData, setChartData] = useState([]);

  const fetchTestimonyCounts = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/testimony/testimony-cnt-by-transcripts/`
      );
      const data = await res.json();
      setChartData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTestimonyCounts();
  }, []);

  useEffect(() => {
    if (chartData.length === 0) return;

    const width = 700;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 80, left: 80 };

    d3.select("#static-scatter").selectAll("*").remove();

    const svg = d3
      .select("#static-scatter")
      .append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // X scale: transcript names
    const x = d3
      .scaleBand()
      .domain(chartData.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    // Y scale: testimony counts
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.testimony_count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(chartData.map(d => d.name));

    // Draw dots
    svg
      .selectAll("circle")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.name) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.testimony_count))
      .attr("r", 10)
      .attr("fill", (d) => color(d.name))
      .attr("opacity", 0.7);

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("padding", "6px 10px")
      .style("background", "#f0f0f0")
      .style("border-radius", "4px")
      .style("box-shadow", "0px 0px 5px rgba(0,0,0,0.3)")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("font-size", "14px");

    svg.selectAll("circle")
      .on("mouseover", function (event, d) {
        tooltip.style("opacity", 1)
               .html(`<strong>${d.name}</strong><br/>Count: ${d.testimony_count}`);
      })
      .on("mousemove", function (event) {
        tooltip.style("left", event.pageX + 10 + "px")
               .style("top", event.pageY - 25 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

    // X axis (ticks hidden)
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(() => "")); // hide transcript names

    // X-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 40)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Transcript Name");

    // Y axis with numeric ticks
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6))
      .selectAll("text")
      .style("font-size", "12px");

    // Y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20) // shift right from left edge after rotation
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Testimony Count");
  }, [chartData]);

  return( 
  <>
  <p className="fw-bold">Testimony Count by Transcript</p>
  <div id="static-scatter" style={{ position: "relative", width: "100%" }}>
    
  </div>
  </>)
}
