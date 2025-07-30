import React, { useState, useEffect, useRef } from "react";
import { Offcanvas, Form, Dropdown, Button } from "react-bootstrap";
import { Sliders } from "react-bootstrap-icons";
import { useSearchContext } from "../contexts/SearchContext";

const Filter = ({
  show,
  handleClose,

  // testimonyCnt,
  // fuzzyTranscripts,
  // fuzzyWitnesses,
  // sendSearchCToParent,
  // sendSearchBToParent,
}) => {
  const {
    searchA,
    setSearchA,
    selectedWitness,
    setSelectedWitness,
    selectedTranscripts,
    setSelectedTranscripts,
    selectedWitnessType,
    setSelectedWitnessType,
    fuzzyTranscripts,
    setFuzzyTranscripts,
    // fuzzyWitnesses,
    // setFuzzyWitnesses,
  } = useSearchContext();
  const didMountTranscript = useRef(false);
  const didMountWitness = useRef(false);
  const didMountType = useRef(false);
const didInit = useRef(false);

  const [transcript, setTranscript] = useState([]);
  const [witness, setWitness] = useState([]);
  const [witnessType, setWitnessType] = useState([]);
  const [witnessAlignment, setWitnessAlignment] = useState([]);
  // const [selectedTranscripts, setSelectedTranscripts] = useState([]);
  const [selectedWitnesses, setSelectedWitnesses] = useState([]);
  const [selectedAlignments, setSelectedAlignments] = useState([]);
  const [selectedWitnessTypes, setSelectedWitnessTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transcripts, witnesses, types, alignments] = await Promise.all([
          fetch(`${process.env.REACT_APP_PROD_API_URL}/api/transcript/`).then(
            (res) => res.json()
          ),
          fetch(`${process.env.REACT_APP_PROD_API_URL}/api/witness/`).then(
            (res) => res.json()
          ),
          fetch(`${process.env.REACT_APP_PROD_API_URL}/api/witness-type/`).then(
            (res) => res.json()
          ),
          fetch(
            `${process.env.REACT_APP_PROD_API_URL}/api/witness-alignment/`
          ).then((res) => res.json()),
        ]);

        setTranscript(transcripts.transcripts);
        setWitness(witnesses.witnesses);
        setWitnessType(types.witnesses);
        setWitnessAlignment(alignments.witnesses);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const uniqueTranscripts = Array.from(
    new Map(transcript.map((item) => [item.name, item])).values()
  );
  const uniqueWitnesses = Array.from(
    new Map(witness.map((item) => [item.fullname, item])).values()
  );

  // useEffect(() => {
  //   if (didMountTranscript.current) {
  //     sendTranscriptToParent?.(selectedTranscripts);
  //   } else {
  //     didMountTranscript.current = true;
  //   }
  // }, [selectedTranscripts]);

  // useEffect(() => {
  //   setSelectedTranscripts(fuzzyTranscripts);
  // }, [fuzzyTranscripts]);

  // useEffect(() => {
  //   if (didMountWitness.current) {
  //     sendWitnessToParent?.(selectedWitnesses);
  //   } else {
  //     didMountWitness.current = true;
  //   }
  // }, [selectedWitnesses]);

  // useEffect(() => {
  //   setSelectedWitnesses(fuzzyWitnesses);
  // }, [fuzzyWitnesses]);
//   useEffect(() => {
//   if (!didInit.current) {
//     didInit.current = true;
//     return;
//   }

//   setSelectedTranscripts(fuzzyTranscripts);
// }, [fuzzyTranscripts]);

  // useEffect(() => {
  //   if (didMountType.current) {
  //     sendWitnessTypeToParent?.(selectedWitnessTypes);
  //   } else {
  //     didMountType.current = true;
  //   }
  // }, [selectedWitnessTypes]);

  const handleTranscriptCheck = (option) => {
    setSelectedTranscripts((prev) =>
      prev.includes(option.name)
        ? prev.filter((name) => name !== option.name)
        : [...prev, option.name]
    );
    // sendSearchCToParent("");
  };

  const handleWitnessCheck = (option) => {
    const fullName = option.fullname;
    setSelectedWitnesses((prev) =>
      prev.includes(fullName)
        ? prev.filter((name) => name !== fullName)
        : [...prev, fullName]
    );
    // sendSearchBToParent("");
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
                {uniqueWitnesses.map((option) => (
                  <Form.Check
                    key={option.id}
                    type="checkbox"
                    label={option.fullname}
                    className="px-3 py-1"
                    checked={selectedWitnesses.includes(option.fullname)}
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
            <h5 className="mb-1 fw-bold">Testimony Count</h5>
            {/* <h5 className=" mb-0">{testimonyCnt}</h5> */}
          </div>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Filter;
