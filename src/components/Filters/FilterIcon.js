import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import { WitnessFilter, TranscriptFilter } from "./Filters";
const FilterSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Sticky Filter Button */}
      <div style={styles.filterBtn} onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faFilter} style={{ fontSize: "20px" }} />
      </div>

      {/* Overlay (click to close) */}
      {isOpen && <div style={styles.overlay} onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <div style={{ ...styles.sidebar, right: isOpen ? "0" : "-300px" }}>
        <div style={styles.sidebarHeader}>
          <h3>Apply Filters</h3>
          <FontAwesomeIcon
            icon={faTimes}
            style={styles.closeIcon}
            onClick={toggleSidebar}
          />
        </div>
        <div style={styles.sidebarContent}>
          {/* Your filter options go here */}
            <WitnessFilter/>
            <TranscriptFilter/>
        </div>
      </div>
    </>
  );
};

const styles = {
  filterBtn: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: 1001,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1000,
  },
  sidebar: {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    width: "300px",
    backgroundColor: "#fff",
    boxShadow: "-4px 0 8px rgba(0,0,0,0.2)",
    zIndex: 1002,
    padding: "20px",
    transition: "right 0.3s ease",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
    paddingBottom: "10px",
  },
  closeIcon: {
    fontSize: "18px",
    cursor: "pointer",
  },
  sidebarContent: {
    marginTop: "20px",
  },
};

export default FilterSidebar;
