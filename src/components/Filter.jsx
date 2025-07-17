import React, { useState, useEffect } from "react";
import { Offcanvas, Form, Dropdown, Button } from "react-bootstrap";
import { Sliders } from "react-bootstrap-icons";
import BASE_URL from "../api";

const Filter = ({
  show,
  handleClose,
  sendTranscriptToParent,
  sendWitnessToParent,
  sendWitnessTypeToParent,
  totalCount
}) => {
  const [transcript, setTranscript] = useState([]);
  const [witness, setWitness] = useState([]);
  const [witnessType, setWitnessType] = useState([]);
  const [witnessAlignment, setWitnessAlighment] = useState([]);
  const [selectedTranscripts, setSelectedTranscripts] = useState([]);
  const [selectedWitnesses, setSelectedWitnesses] = useState([]);
  const [selectedAlignments, setSelectedAlignments] = useState([]);
  const [selectedWitnessTypes, setSelectedWitnessTypes] = useState([]);

  const fetchTranscripts = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_PROD_API_URL}/api/transcript/`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setTranscript(data.transcripts);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchWitness = async () => {
    try {
      const res = await fetch(`http://20.163.175.235/api/witness/`);
      const data = await res.json();
      setWitness(data.witnesses);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchWitnessType = async () => {
    try {
      const res = await fetch(`http://20.163.175.235/api/witness-type/`);
      const data = await res.json();
      setWitnessType(data.witnesses);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchWitnessAlignment = async () => {
    try {
      const res = await fetch(`http://20.163.175.235/api/witness-alignment/`);
      const data = await res.json();
      setWitnessAlighment(data.witnesses);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    fetchTranscripts();
    fetchWitness();
    fetchWitnessType();
    fetchWitnessAlignment();
  }, []);

  // Deduplicate by name
  const uniqueTranscripts = Array.from(
    new Map(transcript.map((item) => [item.name, item])).values()
  );
  const uniqueWitnesses = Array.from(
    new Map(
      witness.map((item) => [`${item.first_name} ${item.last_name}`, item])
    ).values()
  );

  // Send to parent on change
  useEffect(() => {
    if (typeof sendTranscriptToParent === "function") {
      sendTranscriptToParent(selectedTranscripts);
    }
  }, [selectedTranscripts]);

  useEffect(() => {
    if (typeof sendWitnessToParent === "function") {
      sendWitnessToParent(selectedWitnesses);
    }
  }, [selectedWitnesses]);

  useEffect(() => {
    if (typeof sendWitnessTypeToParent === "function") {
      sendWitnessTypeToParent(selectedWitnessTypes);
    }
  }, [selectedWitnessTypes]);
  // Store only transcript names
  const handleTranscriptCheck = (option) => {
    setSelectedTranscripts((prev) =>
      prev.includes(option.name)
        ? prev.filter((name) => name !== option.name)
        : [...prev, option.name]
    );
  };

  // Store only witness full names (string)
  const handleWitnessCheck = (option) => {
    const fullName = `${option.first_name} ${option.last_name}`;
    setSelectedWitnesses((prev) =>
      prev.includes(fullName)
        ? prev.filter((name) => name !== fullName)
        : [...prev, fullName]
    );
  };

  const handleAlignmentChange = (alignment) => {
    setSelectedAlignments((prev) =>
      prev.includes(alignment)
        ? prev.filter((item) => item !== alignment)
        : [...prev, alignment]
    );
  };

  const handleWitnessTypeChange = (type) => {
    setSelectedWitnessTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
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
            <Dropdown className="w-100">
              <Dropdown.Toggle
                variant="light"
                className="w-100 text-start border rounded-2"
              >
                {selectedTranscripts.length > 0 ? (
                  <div className="d-flex flex-wrap gap-1">
                    {selectedTranscripts.map((name, idx) => (
                      <span key={idx} className="badge bg-primary">
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  "Select transcript(s)"
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                {uniqueTranscripts.map((option) => (
                  <Form.Check
                    key={option.id}
                    type="checkbox"
                    label={option.name}
                    className="px-3 py-1"
                    style={{ whiteSpace: "nowrap" }}
                    checked={selectedTranscripts.includes(option.name)}
                    onChange={() => handleTranscriptCheck(option)}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          {/* Witness Filter */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Witness</Form.Label>
            <Dropdown className="w-100">
              <Dropdown.Toggle
                variant="light"
                className="w-100 text-start border rounded-2"
              >
                {selectedWitnesses.length > 0 ? (
                  <div className="d-flex flex-wrap gap-1">
                    {selectedWitnesses.map((name, idx) => (
                      <span key={idx} className="badge bg-success">
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  "Select witness(es)"
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                {uniqueWitnesses.map((option) => {
                  const fullName = `${option.first_name} ${option.last_name}`;
                  return (
                    <Form.Check
                      key={option.id}
                      type="checkbox"
                      label={fullName}
                      className="px-3 py-1"
                      checked={selectedWitnesses.includes(fullName)}
                      onChange={() => handleWitnessCheck(option)}
                    />
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          {/* Witness Alignment */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Witness Alignment</Form.Label>
            <div className="d-flex flex-wrap gap-3 ps-1">
              {witnessAlignment.map((alignment) => (
                <Form.Check
                  key={alignment.alignment}
                  type="checkbox"
                  label={alignment.alignment}
                  value={alignment.alignment}
                  checked={selectedAlignments.includes(alignment.alignment)}
                  onChange={() => handleAlignmentChange(alignment.alignment)}
                />
              ))}
            </div>
          </Form.Group>

          {/* Witness Type */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Witness Type</Form.Label>
            <div className="d-flex flex-wrap gap-3 ps-1">
              {witnessType.map((typeObj) => (
                <Form.Check
                  key={typeObj.type}
                  type="checkbox"
                  label={typeObj.type}
                  value={typeObj.type}
                  checked={selectedWitnessTypes.includes(typeObj.type)}
                  onChange={() => handleWitnessTypeChange(typeObj.type)}
                />
              ))}
            </div>
          </Form.Group>

          {/* Testimony Count */}
          <div className="bg-primary text-white text-center py-3 px-2 rounded-3">
            <h6 className="mb-1">Testimony Count</h6>
            <h2 className="fw-bold mb-0">{totalCount}</h2>
          </div>

          {/* Apply & Reset */}
          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Filter;
