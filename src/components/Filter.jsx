import React, { useState } from "react";
import { Offcanvas, Form, Dropdown, Button } from "react-bootstrap";
import { Sliders } from "react-bootstrap-icons";

const Filter = ({ show, handleClose }) => {
  // State to manage selected transcripts
  const transcriptOptions = [
    "Transcript A",
    "Transcript B",
    "Transcript C",
    "Transcript D",
    "Transcript E",
  ];
  const [selectedTranscripts, setSelectedTranscripts] = useState([]);

  const handleTranscriptCheck = (option) => {
    setSelectedTranscripts((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    );
  };
  // Witness
  const witnessOptions = [
    "Witness X",
    "Witness Y",
    "Witness Z",
    "Witness Alpha",
    "Witness Beta",
  ];
  const [selectedWitnesses, setSelectedWitnesses] = useState([]);
  const handleWitnessCheck = (option) => {
    setSelectedWitnesses((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };
  // Witness Alignment
  const [selectedAlignments, setSelectedAlignments] = useState([]);
const handleAlignmentChange = (alignment) => {
  setSelectedAlignments((prevSelected) =>
    prevSelected.includes(alignment)
      ? prevSelected.filter((item) => item !== alignment)
      : [...prevSelected, alignment]
  );
};

  // Witness Type
  const [selectedWitnessTypes, setSelectedWitnessTypes] = useState([]);
const handleWitnessTypeChange = (type) => {
  setSelectedWitnessTypes((prevSelected) =>
    prevSelected.includes(type)
      ? prevSelected.filter((item) => item !== type)
      : [...prevSelected, type]
  );
};


  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-semibold">
          <Sliders className="me-2" /> Filter Options
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="bg-light">
        <div className="bg-white p-3 rounded-3 shadow-sm">
          {/* Transcript Filter */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Transcript</Form.Label>
            <Dropdown className="w-100 colum-3-sorath">
              <Dropdown.Toggle
                variant="light"
                className="w-100 text-start border rounded-2 filter-drp-sorath"
              >
                {selectedTranscripts.length > 0 ? (
                  <div className="d-flex flex-wrap gap-1">
                    {selectedTranscripts.map((item, idx) => (
                      <span key={idx} className="badge bg-primary">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  "Select transcript(s)"
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="w-100 border rounded-2 shadow"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {transcriptOptions.map((option, idx) => (
                  <Form.Check
                    key={idx}
                    type="checkbox"
                    label={option}
                    className="px-3 py-1"
                    checked={selectedTranscripts.includes(option)}
                    onChange={() => handleTranscriptCheck(option)}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          {/* Witness Filter */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Witness</Form.Label>
            <Dropdown className="w-100 colum-3-sorath">
              <Dropdown.Toggle
                variant="light"
                className="w-100 text-start border rounded-2 filter-drp-sorath"
              >
                {selectedWitnesses.length > 0 ? (
                  <div className="d-flex flex-wrap gap-1">
                    {selectedWitnesses.map((item, idx) => (
                      <span key={idx} className="badge bg-success">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  "Select witness(es)"
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="w-100 border rounded-2 shadow"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {witnessOptions.map((option, idx) => (
                  <Form.Check
                    key={idx}
                    type="checkbox"
                    label={option}
                    className="px-3 py-1"
                    checked={selectedWitnesses.includes(option)}
                    onChange={() => handleWitnessCheck(option)}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          {/* Witness Alignment */}
<Form.Group className="mb-4">
  <Form.Label className="fw-semibold">Witness Alignment</Form.Label>
  <div className="d-flex flex-wrap gap-3 ps-1">
    {["Left", "Center", "Right"].map((alignment) => (
      <Form.Check
        key={alignment}
        type="checkbox"
        label={alignment}
        value={alignment}
        checked={selectedAlignments.includes(alignment)}
        onChange={() => handleAlignmentChange(alignment)}
      />
    ))}
  </div>
</Form.Group>

          {/* Witness Type */}
<Form.Group className="mb-4">
  <Form.Label className="fw-semibold">Witness Type</Form.Label>
  <div className="d-flex flex-wrap gap-3 ps-1">
    {["Eyewitness", "Expert", "Anonymous"].map((type) => (
      <Form.Check
        key={type}
        type="checkbox"
        label={type}
        value={type}
        checked={selectedWitnessTypes.includes(type)}
        onChange={() => handleWitnessTypeChange(type)}
      />
    ))}
  </div>
</Form.Group>


          {/* Testimony Count Box */}
          <div className="bg-primary text-white text-center py-3 px-2 rounded-3">
            <h6 className="mb-1">Testimony Count</h6>
            <h2 className="fw-bold mb-0">37</h2>
          </div>

          {/* Apply & Reset */}
          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => alert("Apply clicked")}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Filter;
