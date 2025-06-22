import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Container,
  Row,
  Col,
  InputGroup,
  Input,
  FormGroup,
  Label,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import * as XLSX from "xlsx";
import pluralize from "pluralize";
import Header from "components/Headers/Header.js";

const Index = () => {
  const [qaPairs, setQaPairs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState("fuzzy");
  const [highlightResults, setHighlightResults] = useState({});
  const [numRecords, setNumRecords] = useState(0)
  
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const handleChange = (e) => {
    setSelected(e.target.value);
    fetchSearchResults(searchTerm); // ✅ pass value directly
  };

  const getWordForms = (word) => {
    const base = word.toLowerCase();
    return Array.from(
      new Set([base, pluralize.singular(base), pluralize.plural(base)])
    );
  };

  // API call to fetch all data
  const fetchTranscriptFromDjango = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/fetch-transcripts/");
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setQaPairs(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Call once to populate qaPairs
  useEffect(() => {
    fetchTranscriptFromDjango();
  }, []);

  // Search logic
  // useEffect(() => {

  //   fetchSearchResults();
  // }, [searchTerm, selected]);

  const getHighlights = (text, query) => {
    if (!query.trim()) return [];

    const highlights = [];
    const textLower = text.toLowerCase();
    const queryWords = query.trim().toLowerCase().split(/\s+/);

    for (const word of queryWords) {
      if (textLower.includes(word)) {
        highlights.push(word);
      }
    }

    return highlights;
  };
  const fetchSearchResults = async (searchText) => {
    if (!searchText.trim()) {
      setHighlightResults({});
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/search?mode=${encodeURIComponent(
          selected
        )}&q=${encodeURIComponent(searchText)}`
      );
      const data = await res.json();
      console.log("data", data.count)
      setNumRecords(data.count)
      const results = {};
      data.results.forEach((item) => {
        const key = item.question + item.answer + item.cite;
        results[key] = {
          question: item.question,
          answer: item.answer,
          cite: item.cite,
          highlights: item.highlights || {},
        };
      });

      setHighlightResults(results);
    } catch (err) {
      console.error("Search failed:", err.message);
      setHighlightResults({});
    }
  };

  const renderCell = (text, highlights) => {
    if (!highlights || !highlights.length) return text;
    const pattern = highlights
      .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    const regex = new RegExp(`(${pattern})`, "gi");

    return text.split(regex).map((part, i) =>
      highlights.includes(part.toLowerCase()) ? (
        <mark key={i} style={{ backgroundColor: "yellow" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const downloadExcel = () => {
    const worksheetData = filteredQaPairs.map((qa) => ({
      Question: qa.question,
      Answer: qa.answer,
      Citation: qa.cite,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "QA Pairs");
    XLSX.writeFile(workbook, "QA_Pairs.xlsx");
    toggle()
  };

  const filteredQaPairs = searchTerm.trim()
    ? qaPairs.filter((qa) => {
        const key = qa.question + qa.answer + qa.cite;
        return highlightResults[key];
      })
    : qaPairs;

  return (
    <>
      <Header />
       <Modal isOpen={modal} toggle={toggle}>
        <ModalBody>
          You are about to download {numRecords} QA Pairs. Are you sure you want to proceed?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={downloadExcel}>
            OK
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Container className="mt--7" fluid>
        <Row>
          <Col sm="4">
            <InputGroup className="mb-3">
              <Input
                placeholder="Search questions, answers or citations..."
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  fetchSearchResults(value); // ✅ pass value directly
                }}
              />
            </InputGroup>
          </Col>
          <Col sm="6">
            <Form>
              <FormGroup tag="fieldset">
                <div className="d-flex gap-4">
                  {["fuzzy", "boolean", "exact"].map((option) => (
                    <FormGroup check key={option}>
                      <Label
                        check
                        className="d-flex align-items-center mr-4 mt-1 text-white"
                      >
                        <Input
                          type="radio"
                          name="search-mode"
                          value={option}
                          checked={selected === option}
                          onChange={handleChange}
                          style={{
                            width: "15px",
                            height: "15px",
                            accentColor: "#fb6340",
                          }}
                        />
                        <span
                          style={{ marginLeft: "10px", fontSize: "1.1rem" }}
                        >
                          {option}
                        </span>
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              </FormGroup>
            </Form>
          </Col>
          <Col sm="2">
            <Button color="success" className="mb-3" onClick={toggle}>
              Download Excel
            </Button>
          </Col>
        </Row>

        <Row>
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Transcript QA Table</h3>
            </CardHeader>
            <Table  className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th scope="col">Question</th>
                  <th scope="col">Answer</th>
                  <th scope="col">Citation</th>
                </tr>
              </thead>
              <tbody>
                {/* {filteredQaPairs.map((qa, index) => {
                  const key = qa.question + qa.answer + qa.cite;
                  const highlight = highlightResults[key]?.highlights || {};
                  return (
                    <tr key={index}>
                      <td>{renderCell(qa.question, highlight.question || [])}</td>
                      <td>{renderCell(qa.answer, highlight.answer || [])}</td>
                      <td>{renderCell(qa.cite, highlight.cite || [])}</td>
                    </tr>
                  );
                })} */}
                {filteredQaPairs.map((qa, index) => {
                  const questionHighlights = getHighlights(
                    qa.question,
                    searchTerm
                  );
                  const answerHighlights = getHighlights(qa.answer, searchTerm);
                  const citeHighlights = getHighlights(qa.cite, searchTerm);

                  return (
                    <tr key={index}>
                      <td>{renderCell(qa.question, questionHighlights)}</td>
                      <td>{renderCell(qa.answer, answerHighlights)}</td>
                      <td>{renderCell(qa.cite, citeHighlights)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </Row>
      </Container>
    </>
  );
};

export default Index;
