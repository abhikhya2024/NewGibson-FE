import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Card, Table } from "react-bootstrap";
import BASE_URL from "../../api";

const WitnessFilter = () => {
  const [witnesses, setWitnesses] = useState([]);
  const [selectedWitnessIds, setSelectedWitnessIds] = useState(new Set());


  const fetchWitness = async () => {
    const res = await fetch(`http://20.163.175.235/api/witness/`);
    const data = await res.json();
    setWitnesses(data.witnesses);
  };

  const handleRowClick = (witnessId) => {
    setSelectedWitnessIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(witnessId) ? newSet.delete(witnessId) : newSet.add(witnessId);
      return newSet;
    });
  };

  useEffect(() => {
    fetchWitness();
  }, []);
  return (
    <Card style={{ height: "200px", width: "240px", overflowY: "auto" }}>
      <Table responsive>
        <thead>
          <tr>
            <th 
            style={{
            backgroundColor: "#11abef",
            color: "white",
            fontWeight: "600",
            fontSize: "11px",
          }}
            >
              Witness Name
            </th>
          </tr>
        </thead>
        <tbody>
          {witnesses.map((w) => {
            const fullName = `${w.first_name || ""} ${w.last_name || ""}`.trim();
            const isSelected = selectedWitnessIds.has(w.id);
            return (
              <tr
                key={w.id}
                onClick={() => handleRowClick(w.id)}
                style={{ backgroundColor: isSelected ? "#dff0ff" : "white" }}
              >
                <td>{fullName}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};

const TranscriptFilter = () => {
  const [transcripts, setTranscripts] = useState([]);
  const [selectedTranscriptIds, setSelectedTranscriptIds] = useState(new Set());


  const fetchTranscripts = async () => {
    try {
      const res = await fetch(`http://20.163.175.235/api/transcript/`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setTranscripts(data.transcripts);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const handleRowClick = (transcriptId) => {
    setSelectedTranscriptIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(transcriptId) ? newSet.delete(transcriptId) : newSet.add(transcriptId);
      return newSet;
    });
  };

 
  return (
    <Card style={{ height: "200px", width: "240px", overflowY: "auto" }}>
      <Table
        className="align-items-center table-flush"
        style={{ fontSize: "11px" }}
        responsive
      >
        <thead
          style={{
            backgroundColor: "#11abef",
            color: "white",
            fontWeight: "600",
            fontSize: "11px",
            position: "sticky",

          }}
        >
          <tr>
            <th scope="col">Transcript</th>
          </tr>
        </thead>
        <tbody>
          {transcripts.map((tn) => {
            const isSelected = selectedTranscriptIds.has(tn.id);

            return (
              <tr
                key={tn.id}
                onClick={() => handleRowClick(tn.id)}
                style={{ backgroundColor: isSelected ? "#dff0ff" : "white" }}
              >
                <td>{tn.name}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};
export { WitnessFilter, TranscriptFilter}