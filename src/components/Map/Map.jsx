import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { feature } from "topojson-client";
import { geoCentroid } from "d3-geo";
import { Col, Row } from "react-bootstrap";

const geoUrlStates = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const geoUrlCounties =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

// ✅ Only names, no coordinates
const dummyMarkers = [
  { state: "Virginia", county: "Alexandria" },
  { state: "Delaware", county: "New Castle" },
  { state: "New York", county: "Kings" },
  { state: "Illinois", county: "Cook" },
];

export default function USAClickableMap() {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedStateFips, setSelectedStateFips] = useState(null);
  const [countiesData, setCountiesData] = useState([]);
  const [stateCentroid, setStateCentroid] = useState([-98.5795, 39.8283]);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [countyMarkers, setCountyMarkers] = useState([]);
  const [allCounties, setAllCounties] = useState([]);

  // 🔹 Load all counties once
  useEffect(() => {
    const loadCounties = async () => {
      const res = await fetch(geoUrlCounties);
      const topo = await res.json();
      const counties = feature(topo, topo.objects.counties).features;
      setAllCounties(counties);

      // Compute coordinates for markers
      const resolved = dummyMarkers
        .map((m) => {
          const countyFeature = counties.find(
            (c) => c.properties.name === m.county
          );
          if (countyFeature) {
            return { ...m, coordinates: geoCentroid(countyFeature) };
          }
          return null;
        })
        .filter(Boolean);

      setCountyMarkers(resolved);
    };
    loadCounties();
  }, []);

  // 🔹 Click on marker: select state + highlight county
  const handleMarkerClick = async (marker) => {
    const countyFeature = allCounties.find(
      (c) => c.properties.name === marker.county
    );
    if (!countyFeature) return;

    const stateId = countyFeature.id.slice(0, 2); // FIPS prefix for state
    const stateRes = await fetch(geoUrlStates);
    const stateTopo = await stateRes.json();
    const states = feature(stateTopo, stateTopo.objects.states).features;
    const stateFeature = states.find((s) => s.id === stateId);
    if (!stateFeature) return;

    const centroid = geoCentroid(stateFeature);
    setStateCentroid(centroid);
    setSelectedState({ name: stateFeature.properties.name, id: stateId });
    setSelectedStateFips(stateId);
    setCountiesData(allCounties.filter((c) => c.id.startsWith(stateId)));
    setSelectedCounty(marker.county);
  };

  const handleStateClick = async (geo) => {
    setSelectedState({ name: geo.properties.name, id: geo.id });
    setSelectedStateFips(geo.id);
    setSelectedCounty(null);
    setCountiesData(allCounties.filter((c) => c.id.startsWith(geo.id)));

    const stateFeature = geo;
    if (stateFeature) {
      const centroid = geoCentroid(stateFeature);
      setStateCentroid(centroid);
    }
  };

  const handleCountyClick = (county) => {
    setSelectedCounty(county.properties.name);
  };

  return (
    <div className="flex gap-4">
      <div className="w-1/2 flex justify-center items-start flex-col p-0">
        <Row>
          <Col>
            <div className="w-full">
              {/* USA Map */}
              <ComposableMap projection="geoAlbersUsa">
                <Geographies geography={geoUrlStates}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleStateClick(geo)}
                        style={{
                          default: {
                            fill: "#e5e7eb",
                            stroke: "#374151",
                            strokeWidth: 0.6,
                          },
                          hover: {
                            fill: "#c7d2fe",
                            stroke: "#111827",
                            strokeWidth: 1,
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: "#a5b4fc",
                            stroke: "#1f2937",
                            strokeWidth: 1,
                          },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {/* 🔴 Markers with Labels */}
                {countyMarkers.map((marker, i) => (
                  <Marker
                    key={i}
                    coordinates={marker.coordinates}
                    onClick={() => handleMarkerClick(marker)}
                  >
                    {/* Wider Google Maps style pin */}
                    <path
                      d="M0,-25 C16,-25 16,-5 0,12 C-16,-5 -16,-25 0,-25 Z"
                      fill="red"
                      stroke="#fff"
                      strokeWidth={2}
                    />
                    {/* White circular dot in the center */}
                    <circle
                      cx={0}
                      cy={-6}
                      r={5}
                      fill="#fff"
                      stroke="#fff"
                      strokeWidth={1}
                    />

                    {/* Label above the pin */}
                    <text
                      textAnchor="middle"
                      y={-34} // move higher so it doesn’t overlap with the larger pin
                      style={{
                        fontFamily: "system-ui",
                        fill: "#111",
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      {marker.county}, {marker.state}
                    </text>
                  </Marker>
                ))}
              </ComposableMap>
            </div>
          </Col>

          <Col>
            {selectedState && (
              <div className="text-center text-lg font-semibold text-gray-800">
                <b>State:</b> {selectedState.name}
                <br />
                <b>Total Counties:</b> {countiesData.length}
                <br />
                {selectedCounty && (
                  <span>
                    <b>Selected County:</b> {selectedCounty}
                  </span>
                )}
                <br/>
                <br/>
                <span><b>Transcripts: </b> IPR2017-01812 1126 - Joey Chen Deposition</span>
              </div>
            )}

            {/* Zoomed-in state with counties */}
            <div className="bg-gray-50 w-full max-w-[800px]">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 2000, center: stateCentroid }}
                width={800}
                height={500}
              >
                <Geographies geography={countiesData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const isSelected = geo.properties.name === selectedCounty;
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => handleCountyClick(geo)}
                          style={{
                            default: {
                              fill: isSelected ? "#fbbf24" : "#e5e7eb",
                              stroke: "#374151",
                              strokeWidth: 0.7,
                            },
                            hover: {
                              fill: "#fcd34d",
                              stroke: "#111827",
                              strokeWidth: 1,
                              cursor: "pointer",
                            },
                            pressed: {
                              fill: "#f59e0b",
                              stroke: "#1f2937",
                              strokeWidth: 1,
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
