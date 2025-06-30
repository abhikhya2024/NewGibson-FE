import { useEffect, useState, useContext } from "react";
import axios from "axios";
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
import Help from "components/Help/Help";
import {
  WitnessFilter,
  WitnessTypeFilter,
  WitnessAlignmentFilter,
  TranscriptFilter,
} from "components/Filters/Filters";
import { WitnessContext, TranscriptContext } from "../providers/Context";

const Index = () => {
  // Providers
  const { selectedWitnesses } = useContext(WitnessContext);
  const { selectedTranscripts } = useContext(TranscriptContext);

  const [qaPairs, setQaPairs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState("fuzzy");
  const [highlightResults, setHighlightResults] = useState({});
  const [numRecords, setNumRecords] = useState(0);

  // Pagination
  const [page, setPage] = useState(1); // starts from page 1
  const [pageSize, setPageSize] = useState(100);

  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(
    "http://localhost:8000/api/testimony/"
  );
  const [data, setData] = useState([]);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const handleChange = (e) => {
    setSelected(e.target.value);
    console.log("Hiii");
    fetchSearchResults(searchTerm); // ✅ pass value directly
  };

  const getWordForms = (word) => {
    const base = word.toLowerCase();
    return Array.from(
      new Set([base, pluralize.singular(base), pluralize.plural(base)])
    );
  };

  // API call to fetch all data
  // useEffect(() => {
  //   const fetchAllData = async () => {
  //     let currentPage = nextPage;

  //     while (currentPage) {
  //       setLoading(true);
  //       try {
  //         const res = await axios.get(currentPage);
  //         setQaPairs((prev) => [...prev, ...res.data.testimonies]);
  //         currentPage = res.data.next; // Next page URL from backend
  //       } catch (err) {
  //         console.error("Failed to fetch:", err);
  //         break; // Stop on error
  //       }
  //     }
  //     setLoading(false);
  //   };

  //   fetchAllData();
  // }, []); // 👈 Only runs once

  // Apply witness filter
  const fetchQAByWitnesses = async (newPage, overridePageSize = pageSize) => {
    setLoading(true);

    try {
      if (selectedWitnesses.length === 0) {
        // 🔹 Fetch all testimonies (no witness filter)
        const res = await axios.get(
          `http://localhost:8000/api/testimony/?page=${newPage}&page_size=${overridePageSize}`
        );
        setQaPairs(res.data.results);
        setTotalCount(res.data.count);
        setPage(newPage);
      } else {
        // 🔹 Fetch testimonies for selected witnesses
        const names = selectedWitnesses.map((w) =>
          `${w.first_name} ${w.last_name}`.trim()
        );

        const res = await axios.post(
          `http://localhost:8000/api/testimony/testimony-by-witness/?page=${newPage}&page_size=${overridePageSize}`,
          { witness_names: names }
        );
        setQaPairs(res.data.results || []);
        setTotalCount(res.data.count || 0);
        setPage(newPage);
      }
    } catch (err) {
      console.error("Failed to fetch testimonies:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchQAByWitnesses(1); // Always reset to page 1 on filter change
  // }, [selectedWitnesses]);

  // Apply transcript filter
  const fetchSearchResults = async (newPage, overridePageSize = pageSize, searchText) => {
    setLoading(true);

    try {
 
        // 🔹 Fetch testimonies for selected witnesses
        const transcript_names = selectedTranscripts.map((t) =>
          `${t.name}`.trim()
        );

        const names = selectedWitnesses.map((w) =>
          `${w.first_name} ${w.last_name}`.trim()
        );
        const res = await axios.post(
          `http://localhost:8000/api/testimony/combined-search/?page=${newPage}&page_size=${overridePageSize}`,

          {
            q: searchText,
            mode: selected,
            witness_names: names,
            transcript_names: transcript_names,
          }
        );
        setQaPairs(res.data.results || []);
        setTotalCount(res.data.count || 0);
        setPage(newPage);
      
    } catch (err) {
      console.error("Failed to fetch testimonies:", err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchSearchResults(1, pageSize, searchTerm); // Reset to page 1 on filter change
}, [selectedWitnesses, selectedTranscripts]);

  useEffect(() => {
    fetchPaginatedData(1); // Load first page
  }, []);

  const fetchPaginatedData = async (newPage, overridePageSize = pageSize) => {
    if (newPage < 1) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/testimony/?page=${newPage}&page_size=${overridePageSize}`
      );
      setQaPairs(res.data.results);
      setTotalCount(res.data.count);
      setPage(newPage);
    } catch (err) {
      console.error("Failed to fetch paginated data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search logic
  // useEffect(() => {

  //   fetchSearchResults();
  // }, [searchTerm, selected]);
  const getHighlights = (text, query) => {
    if (!query.trim()) return [];

    const booleanOperators = new Set(["and", "or", "not"]);
    const highlights = [];
    const textLower = text.toLowerCase();

    // Matches:
    // - quoted phrases ("contract breach")
    // - single words (excluding slop/proximity patterns like /s, /p, /5)
    const matches =
      query.toLowerCase().match(/"[^"]+"|\b(?!\/(s|p|\d+)\b)\w+\b/g) || [];

    const keywords = matches
      .map((word) => word.replace(/^"|"$/g, "")) // Remove surrounding quotes
      .filter(
        (word) =>
          word &&
          !booleanOperators.has(word) &&
          !["(", ")"].includes(word) &&
          !/^\/(s|p|\d+)$/.test(word)
      );

    for (const word of keywords) {
      if (textLower.includes(word)) {
        highlights.push(word);
      }
    }

    return highlights;
  };

  // const fetchSearchResults = async (searchText) => {
  //   if (!searchText.trim()) {
  //     setHighlightResults({});
  //     return;
  //   }

  //   try {
  //     const res = await fetch(
  //       `http://localhost:8000/api/search?mode=${encodeURIComponent(
  //         selected
  //       )}&q=${encodeURIComponent(searchText)}`
  //     );
  //     const data = await res.json();
  //     console.log("data", data.count);
  //     setNumRecords(data.count);
  //     const results = {};
  //     data.results.forEach((item) => {
  //       const key = item.question + item.answer + item.cite;
  //       // + item.filename;
  //       results[key] = {
  //         question: item.question,
  //         answer: item.answer,
  //         cite: item.cite,
  //         // filename: item.filename,
  //         highlights: item.highlights || {},
  //       };
  //     });

  //     setHighlightResults(results);
  //   } catch (err) {
  //     console.error("Search failed:", err.message);
  //     setHighlightResults({});
  //   }
  // };

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
      // Filename: qa.filename,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "QA Pairs");
    XLSX.writeFile(workbook, "QA_Pairs.xlsx");
    toggle();
  };

  const filteredQaPairs = searchTerm.trim()
    ? qaPairs.filter((qa) => {
        const key = qa.question + qa.answer + qa.cite;
        // + qa.filename;
        return highlightResults[key];
      })
    : qaPairs;

  return (
    <>
      <Header numRecords={numRecords} />
      <Modal isOpen={modal} toggle={toggle}>
        <ModalBody>
          You are about to download {numRecords} QA Pairs. Are you sure you want
          to proceed?
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
            <Row>
              <Col>
                <Form>
                  <FormGroup tag="fieldset">
                    <div className="d-flex gap-4">
                      {["fuzzy", "boolean", "exact"].map((option) => (
                        <FormGroup check key={option}>
                          <Label
                            check
                            className="d-flex align-items-center mr-3 mt-1 text-white"
                          >
                            <Input
                              type="radio"
                              name="search-mode"
                              value={option}
                              checked={selected === option}
                              onChange={(e) => handleChange(e)}
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
              <Col>
                <Help />

                {/* <img src={help} height={30}/> */}
              </Col>
            </Row>
          </Col>
          <Col sm="2">
            <Button color="success" className="mb-3" onClick={toggle}>
              Download Excel
            </Button>
          </Col>
        </Row>
        <br />
        <br />
        <br />
        <Row>
          <Col sm="9">
            <Card className="shadow" style={{ height: "700px" }}>
              <CardHeader className="border-0">
                <h3 className="mb-0">Transcript QA Table</h3>
              </CardHeader>
              <div>
                <ul>
                  {selectedWitnesses.map((w) => (
                    <li key={w.id}>{`${w.first_name} ${w.last_name}`}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Selected Transcripts</h3>
                <ul>
                  {selectedTranscripts.map((t) => (
                    <li key={t.id}>{`${t.name} ${t.name}`}</li>
                  ))}
                </ul>
              </div>
              <Table className="align-items-center table-flush" responsive>
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
                    const answerHighlights = getHighlights(
                      qa.answer,
                      searchTerm
                    );
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
              {/* <div className="d-flex justify-content-between align-items-center p-3">
                <Button
                  color="primary"
                  disabled={offset === 0 || loading}
                  onClick={() => fetchPaginatedData(offset - limit)}
                >
                  Previous
                </Button>
                <span>
                  Page {Math.floor(offset / limit) + 1} of{" "}
                  {Math.ceil(totalCount / limit)}
                </span>
                <Button
                  color="primary"
                  disabled={offset + limit >= totalCount || loading}
                  onClick={() => fetchPaginatedData(offset + limit)}
                >
                  Next
                </Button>
              </div> */}
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="d-flex align-items-center">
                  <Button
                    color="primary"
                    disabled={page === 1 || loading}
                    onClick={() => fetchPaginatedData(page - 1)}
                    className="me-3"
                  >
                    Previous
                  </Button>
                </div>
                <span>
                  Page {page} of {Math.ceil(totalCount / pageSize)}
                </span>

                <Button
                  color="primary"
                  disabled={page * pageSize >= totalCount || loading}
                  onClick={() => fetchPaginatedData(page + 1)}
                >
                  Next
                </Button>
              </div>
              <div>
                {/* ✅ Rows Per Page Selector */}
                <FormGroup className="mb-0 px-3 py-2">
                  <Label for="pageSizeSelect" className="mb-0 px-2">
                    Rows per page:
                  </Label>
                  <Input
                    type="select"
                    id="pageSizeSelect"
                    value={pageSize}
                    onChange={(e) => {
                      const newSize = Number(e.target.value);
                      setPageSize(newSize);
                      fetchPaginatedData(1, newSize); // 👈 fetch with new size from page 1
                    }}
                    style={{ width: "auto", display: "inline-block" }}
                  >
                    {[10, 25, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
            </Card>
          </Col>
          <Col sm="3">
            <Card
              className="shadow"
              style={{ height: "700px", overflowY: "auto" }}
            >
              <CardHeader className="border-0">
                {" "}
                {/* Reduce bottom padding */}
                <h3>Apply Filters</h3> {/* Reduce bottom margin */}
              </CardHeader>

              <CardBody>
                {" "}
                {/* Use minimal padding inside body */}
                <TranscriptFilter />
                <br />
                {/* {/* <WitnessTypeFilter /> */}
                {/* <WitnessAlignmentFilter /> */}
                <WitnessFilter />
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
