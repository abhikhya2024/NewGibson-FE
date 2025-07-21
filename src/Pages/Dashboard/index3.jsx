import React, { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import axios from "axios";
import { FiFilter, FiSearch } from "react-icons/fi";
import {
  Container,
  Table,
  Form,
  Button,
  Row,
  Col,
  Card,
  Dropdown,
  DropdownButton,
  Badge,
} from "react-bootstrap";
import Filter from "../../components/Filter";
import BASE_URL from "../../api";

const EnhancedTable = () => {
  const [selectedTranscripts, setSelectedTranscripts] = useState([]);

  const handleTranscriptFromChild = (data) => {
    setSelectedTranscripts(data);
  };

  const [selectedWitness, setSelectedWitness] = useState([]);

  const handleWitnessFromChild = (data) => {
    setSelectedWitness(data);
  };

  const [selectedWitnessType, setSelectedWitnessType] = useState([]);

  const handleWitnessTypeFromChild = (data) => {
    setSelectedWitnessType(data);
  };
  const [loading, setLoading] = useState(false);
  const [qaPairs, setQaPairs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [showFilters, setShowFilters] = useState(false);

  const handleShowFilters = () => setShowFilters(true);
  const handleCloseFilters = () => setShowFilters(false);

  const fetchPaginatedData = async (page = 1, pageSize = rowsPerPage) => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_PROD_API_URL}/api/testimony/`, {
        params: {
          page,
          page_size: pageSize,
          // q: searchA,
          // mode: searchAType
        },
      });
      setQaPairs(res.data.results);
      setTotalCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch paginated data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedData(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const [showSearchSection, setShowSearchSection] = useState(false);

  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [searchC, setSearchC] = useState("");

  const [searchAType, setSearchAType] = useState("All");
  const [searchBType, setSearchBType] = useState("All");
  const [searchCType, setSearchCType] = useState("All");

  const [appliedSearch, setAppliedSearch] = useState({
    A: "",
    B: "",
    C: "",
    AType: "exact",
    BType: "exact",
    CType: "exact",
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchSubmit = async (page = 1, pageSize) => {
  setAppliedSearch({
    A: searchA,
    B: searchB,
    C: searchC,
    AType: searchAType,
    BType: searchBType,
    CType: searchCType,
  });

  setLoading(true); // start loading spinner

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_PROD_API_URL}/api/testimony/combined-search/`,
      {
        q: searchA,
        mode: searchAType,
        witness_names: searchB.trim() ? [searchB.trim()] : [],     // ✅ FIXED
        transcript_names: searchC.trim() ? [searchC.trim()] : [],  // ✅ FIXED
      },
      {
        params: {
          page,
          page_size: pageSize,
        },
      }
    );
    
    setQaPairs(res.data.results);
    setTotalCount(res.data.count);
  } catch (err) {
    console.error("Failed to fetch paginated data:", err);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
const fetchData = async () => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_PROD_API_URL}/api/testimony/combined-search/`,
      {
        q: searchA,
        mode: searchAType,
        witness_names: selectedWitness,
        transcript_names: selectedTranscripts,
        witness_types: selectedWitnessType
      },
      {
        params: {
          page: currentPage,
          page_size: rowsPerPage,
        },
      }
    );
    setQaPairs(res.data.results);
    setTotalCount(res.data.count);
  } catch (err) {
    console.error("Failed to fetch paginated data:", err);
  } finally {
    setLoading(false);
  }
};


  if (selectedTranscripts.length > 0 || selectedWitness.length > 0 || selectedWitnessType.length > 0) {
    fetchData();
  }
}, [selectedTranscripts, selectedWitness, selectedWitnessType, currentPage, rowsPerPage, searchA, searchAType]);

  const handleResetSearch = () => {
    setSearchA("");
    setSearchB("");
    setSearchC("");
    setSearchAType("All");
    setSearchBType("All");
    setSearchCType("All");
    setAppliedSearch({
      A: "",
      B: "",
      C: "",
      AType: "All",
      BType: "All",
      CType: "All",
    });
  };

  const matchType = (text, query, type) => {
    if (!query) return true;
    text = text.toLowerCase();
    query = query.toLowerCase();
    switch (type) {
      case "Exact":
        return text === query;
      case "Partial":
        return text.includes(query);
      default:
        return true;
    }
  };

  const handlePageSizeChange = (size) => {
    setRowsPerPage(size);
    setCurrentPage(1); // reset to first page
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <Container fluid className=" px-3">
      <Card className="p-3 show-page-sorath">
        {/* Search & Filter */}
        <Row className="mb-3">
          <Col md={6}>
            {/* <Form.Control
              type="text"
              placeholder="Search customer or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="show-page-sorath"
            /> */}
            <h2>Testimonies</h2>
          </Col>
          <Col md={6} className="d-flex justify-content-end">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowSearchSection((prev) => !prev)}
              className="filter-sorath-btn"
            >
              <FiSearch className="filter-sorath" />
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleShowFilters}
              className="filter-sorath-btn ms-3"
            >
              <FiFilter className="filter-sorath" />
            </Button>
          </Col>
        </Row>

        {/* Conditional Search Section */}

        <Collapse in={showSearchSection}>
          <div className="p-3 bg-light rounded border mb-3">
            <Row>
              {/* Search A */}
              <Col md={4}>
                <Form.Label>Search All Testimony</Form.Label>
                <Form.Control
                  value={searchA}
                  onChange={(e) => setSearchA(e.target.value)}
                  placeholder="Search by test"
                  className="show-page-sorath"
                />
                <div className="mt-2 d-flex gap-2">
                  {["fuzzy", "boolean", "exact"].map((opt) => (
                    <Form.Check
                      key={opt}
                      type="radio"
                      name="searchAType"
                      label={opt}
                      value={opt}
                      checked={searchAType === opt}
                      onChange={(e) => setSearchAType(e.target.value)}
                    />
                  ))}
                </div>
              </Col>

              {/* Search B */}
              <Col md={4}>
                <Form.Label>Search by Witness</Form.Label>
                <Form.Control
                  value={searchB}
                  onChange={(e) => setSearchB(e.target.value)}
                  placeholder="Search by Witness"
                  className="show-page-sorath"
                />
                <div className="mt-2 d-flex gap-2">
                  {["fuzzy", "boolean", "exact"].map((opt) => (
                    <Form.Check
                      key={opt}
                      type="radio"
                      name="searchBType"
                      label={opt}
                      value={opt}
                      checked={searchBType === opt}
                      onChange={(e) => setSearchBType(e.target.value)}
                    />
                  ))}
                </div>
              </Col>

              {/* Search C */}
              <Col md={4}>
                <Form.Label>Search by Filename</Form.Label>
                <Form.Control
                  value={searchC}
                  onChange={(e) => setSearchC(e.target.value)}
                  placeholder="Search by Filename"
                  className="show-page-sorath"
                />
                <div className="mt-2 d-flex gap-2">
                  {["fuzzy", "boolean", "exact"].map((opt) => (
                    <Form.Check
                      key={opt}
                      type="radio"
                      name="searchCType"
                      label={opt}
                      value={opt}
                      checked={searchCType === opt}
                      onChange={(e) => setSearchCType(e.target.value)}
                    />
                  ))}
                </div>
              </Col>
            </Row>

            <div className="mt-3 d-flex justify-content-end gap-2">
              <Button variant="secondary" size="sm" onClick={handleResetSearch}>
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSearchSubmit(currentPage, rowsPerPage)}
              >
                Apply Search
              </Button>
            </div>
          </div>
        </Collapse>

        {/* Table */}
        <Table responsive bordered className="align-middle rounded-3">
          <thead className="table-sorath-three">
            <tr>
              <th style={{ width: "100px" }}>Filename and Cite</th>
              <th style={{ width: "100px" }}>Question and Answers</th>
            </tr>
          </thead>
          <tbody>
            {qaPairs.map((row, idx) => (
              <tr key={idx}>
                <td style={{ width: "100px" }}>
                  {row.transcript_name}
                  <br />
                  {row.cite}
                </td>
                <td style={{ width: "100px" }}>
                  {row.question}
                  <br />
                  {row.answer}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination Footer */}
        <Row className="px-1 py-3 align-items-center">
          <Col>
            <span className="text-muted small">
              {qaPairs.length > 0
                ? `${(currentPage - 1) * rowsPerPage + 1}–${
                    (currentPage - 1) * rowsPerPage + qaPairs.length
                  }`
                : "0"}{" "}
              of {totalCount}
            </span>
          </Col>

          <Col className="text-center">
            <DropdownButton
              title={`Rows per page: ${rowsPerPage}`}
              variant="outline-secondary"
              className="custom-rows-dropdown"
              size="sm"
            >
              {[5, 10, 15, 20, 50, 100].map((n) => (
                <Dropdown.Item
                  key={n}
                  onClick={() => handlePageSizeChange(n)}
                  active={n === rowsPerPage}
                >
                  {n}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>

          <Col className="text-end">
            <div className="d-inline-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>
              <span className="fw-semibold d-flex align-center">
                {currentPage}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      <Filter
        show={showFilters}
        handleClose={handleCloseFilters}
        sendTranscriptToParent={handleTranscriptFromChild}
        sendWitnessToParent={handleWitnessFromChild}
        sendWitnessTypeToParent={handleWitnessTypeFromChild}
      />
    </Container>
  );
};

export default EnhancedTable;
