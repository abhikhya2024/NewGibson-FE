// components/TextHighlighter.js
import React, { useState, useRef } from "react";

const TextHighlighter = ({ children }) => {
  const [selectionText, setSelectionText] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [popoverPos, setPopoverPos] = useState(null);
  const containerRef = useRef(null);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString();

    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setPopoverPos({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY - 40,
      });
      setSelectionText(text);
    } else {
      setPopoverPos(null);
      setSelectionText("");
    }
  };

  const handleSave = () => {
    setHighlights((prev) => [...prev, selectionText]);
    setSelectionText("");
    setPopoverPos(null);
    window.getSelection().removeAllRanges();
  };

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      style={{ position: "relative" }}
    >
      {popoverPos && (
        <div
          style={{
            position: "absolute",
            top: popoverPos.y,
            left: popoverPos.x,
            backgroundColor: "#fff",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            zIndex: 999,
          }}
        >
          <div style={{ marginBottom: "4px" }}>
            Highlight: <strong>{selectionText}</strong>
          </div>
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      )}

      {/* Render your content */}
      {children}

      {/* Show saved highlights */}
      {highlights.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Saved Highlights:</strong>
          <ul>
            {highlights.map((txt, idx) => (
              <li key={idx}>{txt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TextHighlighter;
