import { useEffect, useState, useContext } from "react";
import { Table, Card } from "reactstrap";
import axios from "axios";
import { WitnessContext, TranscriptContext } from "../../providers/Context";

const WitnessFilter = () => {
  const [witnesses, setWitnesses] = useState([]);
  const [selectedWitnessIds, setSelectedWitnessIds] = useState(new Set());

  const { setSelectedWitnesses } = useContext(WitnessContext); // ✅ use setter

  const fetchWitness = async () => {
    const res = await fetch("http://localhost:8000/api/witness/");
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

  useEffect(() => {
    const selected = witnesses.filter((w) => selectedWitnessIds.has(w.id));
    setSelectedWitnesses(selected); // ✅ Send selected to context
  }, [selectedWitnessIds, witnesses]);

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

const WitnessTypeFilter = () => {
  const [witnessType, setWitnessType] = useState([]);
  const fetchWitness = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/witness-type/");
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      console.log("response", data);
      setWitnessType(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchWitness();
  }, []);
  return (
    <>
      <br />
      <br />
      <Card style={{ height: "200px", width: "210px" }}>
        <Table
          className="align-items-center table-flush"
          style={{ fontSize: "11px", height: "150px" }}
          responsive
        >
          <thead
            style={{
              backgroundColor: "#11abef",
              color: "white",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            <tr>
              <th scope="col">Witness Type</th>
            </tr>
          </thead>
          <tbody>
            {witnessType.map((wn, index) => {
              return (
                <tr key={index}>
                  <td
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      padding: "5px 10px", // ↓ Reduce cell padding
                      fontSize: "11px",
                    }}
                  >
                    {wn.type}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </>
  );
};

const TranscriptFilter = () => {
  const [transcripts, setTranscripts] = useState([]);
  const [selectedTranscriptIds, setSelectedTranscriptIds] = useState(new Set());

  const { setSelectedTranscripts } = useContext(TranscriptContext); // ✅ use setter

  const fetchTranscripts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/transcript/");
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

  useEffect(() => {
    const selected = transcripts.filter((w) => selectedTranscriptIds.has(w.id));
    setSelectedTranscripts(selected); // ✅ Send selected to context
  }, [selectedTranscriptIds, transcripts]);

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

const WitnessAlignmentFilter = () => {
  const [witnessAlignment, setWitnessAlignment] = useState([]);
  const [files, setFiles] = useState(null);
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // "2025-06-21"

  const handleFileChange = (e) => {
    const selectedFiles = [...e.target.files];
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files first");
      return;
    }

    const formData = new FormData();

    // Append each file
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Auto-generate file name array and send as JSON string

    try {
      const res = await axios.post(
        "http://localhost:8000/api/transcript/",

        formData,

        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Upload successful!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  const fetchWitness = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/witness-alignment/");
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      console.log("response", data);
      setWitnessAlignment(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchWitness();
  }, []);
  return (
    <>
      {/* <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button> */}
      <Card style={{ height: "200px", width: "210px" }}>
        <Table
          className="align-items-center table-flush"
          style={{ fontSize: "11px", height: "100px" }}
          responsive
        >
          <thead
            style={{
              backgroundColor: "#11abef",
              color: "white",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            <tr>
              <th scope="col">Witness Alignment</th>
            </tr>
          </thead>
          <tbody>
            {witnessAlignment.map((wn, index) => {
              return (
                <tr key={index}>
                  <td
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      padding: "5px 10px", // ↓ Reduce cell padding
                      fontSize: "11px",
                    }}
                  >
                    {wn.alignment}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </>
  );
};
export {
  WitnessFilter,
  WitnessTypeFilter,
  WitnessAlignmentFilter,
  TranscriptFilter,
};
