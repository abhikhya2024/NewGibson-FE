import { useEffect, useState } from "react";
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupText,
  Input,
  FormGroup,
  Label,
  Form,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";
import pluralize from "pluralize";
import stringSimilarity from "string-similarity";
import * as XLSX from "xlsx";

const Index = (props) => {
  const [qaPairs, setQaPairs] = useState([]);
  // Radio button
  const [selected, setSelected] = useState("Fuzzy Search");
  const handleChange = (event) => {
    setSelected(event.target.value);
  };
  // Pluralization

  const [searchTerm, setSearchTerm] = useState("");

  // Helper to get all word forms
  const getWordForms = (word) => {
    const base = word.toLowerCase();
    const forms = new Set([
      base,
      pluralize.singular(base),
      pluralize.plural(base),
    ]);
    return Array.from(forms);
  };

  const matchesFuzzySearch = (text, query) => {
    if (!query.trim()) return { matched: true, highlights: [] };

    const contentWords = text.toLowerCase().split(/\W+/); // Tokenize text
    const queryWords = query.trim().toLowerCase().split(/\s+/); // Tokenize query
    const highlights = new Set();

    for (const word of queryWords) {
      const forms = getWordForms(word);

      // Check for best fuzzy match for each form
      const isMatch = forms.some((form) => {
        const bestMatch = stringSimilarity.findBestMatch(
          form,
          contentWords
        ).bestMatch;
        if (bestMatch.rating >= 0.8) {
          highlights.add(bestMatch.target);
          return true;
        }
        return false;
      });

      if (!isMatch) {
        return { matched: false, highlights: [] };
      }
    }

    return { matched: true, highlights: Array.from(highlights) };
  };
  // Main boolean search function
  const matchesBooleanSearch = (text, query) => {
    if (!query.trim()) return { matched: true, highlights: [] };

    const content = text.toLowerCase();
    const tokens = query.trim().split(/\s+/);

    let stack = [];
    let currentOperator = null;
    let highlights = new Set();

    const evaluate = (wordSet) => {
      if (!wordSet || wordSet.size === 0) return false;
      const match = [...wordSet].some((form) => content.includes(form));
      if (match && currentOperator !== "NOT") {
        wordSet.forEach((w) => {
          if (content.includes(w)) highlights.add(w);
        });
      }
      return currentOperator === "NOT" ? !match : match;
    };

    for (let i = 0; i < tokens.length; i++) {
      const rawToken = tokens[i];
      const token = rawToken.toUpperCase();

      if (["AND", "OR", "NOT"].includes(token)) {
        if (
          token === "NOT" &&
          (i === tokens.length - 1 ||
            ["AND", "OR", "NOT"].includes(tokens[i + 1].toUpperCase()))
        ) {
          continue;
        }
        currentOperator = token;
      } else {
        const forms = getWordForms(rawToken); // judge → [judge, judges]
        const match = evaluate(forms);

        if (stack.length === 0) {
          stack.push(match);
        } else {
          const prev = stack.pop();

          if (currentOperator === "AND") stack.push(prev && match);
          else if (currentOperator === "OR") stack.push(prev || match);
          else if (currentOperator === "NOT") stack.push(prev && match);
          else stack.push(prev && match); // default AND
        }

        currentOperator = null;
      }
    }

    return { matched: stack[0] ?? true, highlights: Array.from(highlights) };
  };

  const keywordSearch = (text, query) => {
    if (!query.trim()) return { matched: true, highlights: [] };
    const highlights = new Set();
    for (const word of query) {
      // Check for best fuzzy match for each form
      if(text.includes(query)){
        highlights.add(query)
        return true;

      }
      else{
                return { matched: false, highlights: [] };

      }
      
    }
  };

  const highlightText = (text, highlights) => {
    if (!highlights.length) return text;

    const pattern = highlights
      .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    const regex = new RegExp(`(${pattern})`, "gi");

    const parts = text.split(regex);

    return parts.map((part, index) =>
      highlights.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
        <mark key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Export to excel
  // Inside your component:
  const downloadExcel = () => {
    const worksheetData = qaPairs.map((qa) => ({
      Question: qa.question,
      Answer: qa.answer,
      Citation: qa.cite,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "QA Pairs");

    XLSX.writeFile(workbook, "QA_Pairs.xlsx");
  };

  const filteredData = qaPairs.filter((qa) => {
    let question, answer, cite;

    if (selected === "Fuzzy Search") {
      question = matchesFuzzySearch(qa.question, searchTerm);
      answer = matchesFuzzySearch(qa.answer, searchTerm);
      cite = matchesFuzzySearch(qa.cite, searchTerm);
    } else if (selected === "Boolean Search") {
      question = matchesBooleanSearch(qa.question, searchTerm);
      answer = matchesBooleanSearch(qa.answer, searchTerm);
      cite = matchesBooleanSearch(qa.cite, searchTerm);
    }
    else if (selected === "Keyword") {
      // Default to keyword search
      question = keywordSearch(qa.question, searchTerm);
      answer = keywordSearch(qa.answer, searchTerm);
      cite = keywordSearch(qa.cite, searchTerm);
    }

    return question.matched || answer.matched || cite.matched;
  });

  const renderCell = (text, highlights) => highlightText(text, highlights);

  // Searching

  // Table Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting
  const [sortColumn, setSortColumn] = useState(null); // "question", "answer", "cite"
  const [sortOrder, setSortOrder] = useState("asc"); // or "desc"

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle sort order
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Step 1: Sort qaPairs
  let sortedData = [...filteredData];
  if (sortColumn) {
    sortedData.sort((a, b) => {
      const aVal = a[sortColumn]?.toString().toLowerCase() || "";
      const bVal = b[sortColumn]?.toString().toLowerCase() || "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Step 2: Paginate sortedData
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const fetchTranscriptFromDjango = async () => {
    try {
      const res = await fetch("http://localhost:8000/fetch-transcript/");
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      console.log("mydata", data);
      setQaPairs(data);
    } catch (err) {
      console.log(err.message);
    }
  };
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  useEffect(() => {
    fetchTranscriptFromDjango();
  });
  return (
    <>
      <Header />
      {/* Page content */}

      <Container className="mt--7" fluid>
        <Row>
          <Col sm="4">
            <InputGroup className="mb-3">
              {/* <InputGroupText>Search</InputGroupText> */}
              <Input
                placeholder="Search questions, answers or citations..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to first page on search
                }}
              />
            </InputGroup>
          </Col>
          <Col sm="6">
            <Form>
              <FormGroup tag="fieldset">
                <div className="d-flex gap-4">
                  {["Fuzzy Search", "Boolean Search", "Keyword"].map(
                    (fruit) => (
                      <FormGroup check key={fruit}>
                        <Label
                          check
                          className="d-flex align-items-center mr-4 mt-1 text-white"
                        >
                          <Input
                            type="radio"
                            name="fruit"
                            value={fruit}
                            checked={selected === fruit}
                            onChange={(e) => setSelected(e.target.value)}
                            style={{
                              width: "15px",
                              height: "15px",
                              accentColor: "#fb6340",
                            }}
                          />
                          <span
                            style={{ marginLeft: "10px", fontSize: "1.1rem" }}
                          >
                            {fruit.charAt(0).toUpperCase() + fruit.slice(1)}
                          </span>
                        </Label>
                      </FormGroup>
                    )
                  )}
                </div>
              </FormGroup>

              {/* <p>Selected: {selectedOption}</p> */}
            </Form>
          </Col>
          <Col sm="2">
            <Button color="success" className="mb-3" onClick={downloadExcel}>
              Download Excel
            </Button>
          </Col>
        </Row>

        <Row className="mt-5">
          {/* <Col className="mb-5 mb-xl-0" xl="8"> */}
          <Card className="shadow">
            <CardHeader className="border-0">
              <Row className="align-items-center">
                {/* <div className="col">
                    <h3 className="mb-0">Page visits</h3>
                  </div> */}
                {/* <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div> */}
              </Row>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th
                    scope="col"
                    onClick={() => handleSort("question")}
                    style={{ cursor: "pointer" }}
                  >
                    Questions{" "}
                    {sortColumn === "question" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("answer")}
                    style={{ cursor: "pointer" }}
                  >
                    Answers{" "}
                    {sortColumn === "answer" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("citation")}
                    style={{ cursor: "pointer" }}
                  >
                    Citations{" "}
                    {sortColumn === "citation" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((qa, index) => {
                  let questionMatch, answerMatch, citeMatch;
                  if (selected === "Fuzzy Search") {
                    questionMatch = matchesFuzzySearch(qa.question, searchTerm);
                    answerMatch = matchesFuzzySearch(qa.answer, searchTerm);
                    citeMatch = matchesFuzzySearch(qa.cite, searchTerm);
                  } else if (selected === "Boolean Search") {
                    questionMatch = matchesBooleanSearch(
                      qa.question,
                      searchTerm
                    );
                    answerMatch = matchesBooleanSearch(qa.answer, searchTerm);
                    citeMatch = matchesBooleanSearch(qa.cite, searchTerm);
                  }
                   else {
                    // Default to keyword search
                    questionMatch = keywordSearch(
                      qa.question,
                      searchTerm
                    );
                    answerMatch = keywordSearch(qa.answer, searchTerm);
                    citeMatch = keywordSearch(qa.cite, searchTerm);
                  }

                  return (
                    <tr key={index}>
                      <td
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          width: "600px",
                        }}
                      >
                        {renderCell(qa.question, questionMatch.highlights)}
                      </td>
                      <td
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          width: "500px",
                        }}
                      >
                        {renderCell(qa.answer, answerMatch.highlights)}
                      </td>
                      <td
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          width: "500px",
                        }}
                      >
                        {renderCell(qa.cite, citeMatch.highlights)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
          {/* </Col> */}
          <div className="pagination mt-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary mx-1"
            >
              Previous
            </button>

            <span className="mx-2 mt-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="btn btn-secondary mx-1"
            >
              Next
            </button>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Index;
