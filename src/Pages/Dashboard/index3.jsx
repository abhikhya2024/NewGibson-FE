import React, { useEffect, useState, useRef } from "react";
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
import { FaCommentAlt } from "react-icons/fa";
import Comments from "../../components/Comments";
import { useSearchContext } from "../../contexts/SearchContext";
const TestimonySearchPage = () => {
    const {
    searchA,
    searchB,
    searchC,
    searchAType,
    searchBType,
    searchCType,
    setSearchA,
    setSearchB,
    setSearchC,
    setSearchAType,
    setSearchBType,
    setSearchCType,
    selectedWitness,
    selectedTranscripts,
    selectedWitnessType,
    fuzzyTranscripts, fuzzyWitnesses,
    setFuzzyTranscripts,
    setFuzzyWitnesses
  } = useSearchContext();
  const [offset, setOffset] = useState(0);
  const rowsPerPage = 100;
  const [limit] = useState(100); // batch size
  const [hasMore, setHasMore] = useState(true); // stop when no more data
  const loaderRef = useRef(null); // sentinel for intersection observer

  const [testimonyId, setTestimonyId] = useState();
  // const [selectedTranscripts, setSelectedTranscripts] = useState([]);
  // const [fuzzyTranscripts, setFuzzyTranscripts] = useState([]);
  // const [fuzzyWitnesses, setFuzzyWitnesses] = useState([]);

  const handleTranscriptFromChild = (data) => {
    setSelectedTranscripts(data);
  };

  const handleSearchCFromChild = (data) => {
    setSearchC(data);
  };

  const handleSearchBFromChild = (data) => {
    setSearchB(data);
  };
  // const [selectedWitness, setSelectedWitness] = useState([]);

  const handleWitnessFromChild = (data) => {
    setSelectedWitness(data);
  };

  // const [selectedWitnessType, setSelectedWitnessType] = useState([]);

  const handleWitnessTypeFromChild = (data) => {
    setSelectedWitnessType(data);
  };
  const [loading, setLoading] = useState(false);
  const [qaPairs, setQaPairs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [filenameCnt, setFilenameCnt] = useState(0);
  const [witnessNameCnt, setWitnessNameCnt] = useState(0);

  const [initialTestimonyCnt, setInitialTestimonyCnt] = useState()
  const [testimonyCnt, setTestimonyCnt] = useState(0);
  const [showInitialTestimonyCnt, setShowInitialTestimonyCnt] = useState(true)
  const handleShowFilters = () => setShowFilters(true);
  const handleCloseFilters = () => setShowFilters(false);
  const handleShowComments = (id) => {
    setTestimonyId(id);
    setShowComments(true);
  };
  const handleCloseComments = () => setShowComments(false);

  const scrollContainerRef = useRef(null);

  const fetchWitness = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/witness/`
      );
      const data = await res.json();
      console.log("witnesses", data.witnesses.length);
      setWitnessNameCnt(data.witnesses.length);
    } catch (err) {
      console.error(err.message);
    }
  };
  // API call
  const fetchPaginatedData = async (offsetValue = 0) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_PROD_API_URL}/api/testimony/`,
        {
          params: {
            offset: offsetValue,
            limit: rowsPerPage,
          },
        }
      );

      // setTestimonyCnt((prev) => prev + res.data.results.length);

      if (res.data.results.length === 0) {
        setHasMore(false);
      } else {
        setQaPairs((prev) => [...prev, ...res.data.results]);
        setInitialTestimonyCnt(res.data.total)
        setShowInitialTestimonyCnt(true)
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedData(offset);
    fetchWitness();
  }, [offset]);

  const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
        setOffset((prev) => prev + rowsPerPage);
      }
    };
    // useEffect(() => {
    //   fetchPaginatedData(currentPage, rowsPerPage);
    // }, [currentPage, rowsPerPage]);
  
    const [showSearchSection, setShowSearchSection] = useState(false);
  
    // const [searchA, setSearchA] = useState("");
    // const [searchB, setSearchB] = useState("");
    // const [searchC, setSearchC] = useState("");
  
    // const [searchAType, setSearchAType] = useState("exact");
    // const [searchBType, setSearchBType] = useState("exact");
    // const [searchCType, setSearchCType] = useState("exact");
  
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
  const getFuzzyTranscripts = async (query) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_PROD_API_URL}/api/transcript/get-transcripts/`,
        { transcript_name: query },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("namesss", res.data.matching_transcripts);
      setFuzzyTranscripts(res.data.matching_transcripts);
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
    }
  };
  const getFuzzyWitnesses = async (query) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_PROD_API_URL}/api/transcript/get-witnesses/`,
        { witness_name: query },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("namesss", res.data.matching_witnesses);
      setFuzzyWitnesses(res.data.matching_witnesses);
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
    }
  };

  const handleSearchSubmit = async () => {
    setAppliedSearch({
      A: searchA,
      B: searchB,
      C: searchC,
      AType: searchAType,
      BType: searchBType,
      CType: searchCType,
    });
    console.log("BType", searchBType);
    setLoading(true); // start loading spinner

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_PROD_API_URL}/api/testimony/combined-search/`,
        {
          q1: searchA,
          mode1: searchAType,
          q2: searchB,
          mode2: searchBType,
          q3: searchC,
          mode3: searchCType,
          witness_names: searchB.trim() ? [searchB.trim()] : [], // ✅ FIXED
          transcript_names: searchC.trim() ? [searchC.trim()] : [], // ✅ FIXED
        },
        {
          params: {
            page: currentPage,
            page_size: rowsPerPage,
          },
        }
      );

      // Filename count
      const uniqueFilenames = new Set(
        res.data.results.map((item) =>
          item.transcript_name.trim().toLowerCase()
        )
      );

      const uniqueCount = uniqueFilenames.size;
      setTotalCount(res.data.count);
      setTestimonyCnt(res.data.count)
      // Witness name count
      const uniqueWitnessNames = new Set(
        res.data.results.map((item) => item.witness_name.trim().toLowerCase())
      );
      const uniqueWitnessCount = uniqueWitnessNames.size;
      setWitnessNameCnt(uniqueWitnessCount);

      setQaPairs(res.data.results);
      setFilenameCnt(uniqueCount);
    } catch (err) {
      console.error("Failed to fetch paginated data:", err);
    } finally {
      setLoading(false);
    }

    getFuzzyTranscripts(searchC);
    getFuzzyWitnesses(searchB);
  };

    const highlightText = (text, keyword) => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{ backgroundColor: "yellow", fontWeight: "bold" }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const didMountRef = useRef(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_PROD_API_URL}/api/testimony/combined-search/`,
        {
          q1: searchA,
          mode1: searchAType,
          q2: searchB,
          mode2: searchBType,
          q3: searchC,
          mode3: searchCType,
          witness_names: selectedWitness,
          transcript_names: selectedTranscripts,
          witness_types: selectedWitnessType,
        },
        {
          params: {
            page: currentPage,
            page_size: rowsPerPage,
          },
        }
      );

      const results = res.data.results;

      const uniqueFilenames = new Set(
        results.map((item) => item.transcript_name.trim().toLowerCase())
      );
      setFilenameCnt(uniqueFilenames.size);

      const uniqueWitnessNames = new Set(
        results.map((item) => item.witness_name.trim().toLowerCase())
      );
      setWitnessNameCnt(uniqueWitnessNames.size);

      setQaPairs(results);
      setTotalCount(res.data.count);
      setShowInitialTestimonyCnt(false)
      setTestimonyCnt(res.data.count)

    } catch (err) {
      console.error("❌ Failed to fetch paginated data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run only on search/filter changes — skip on first mount
  const isFirstRun = useRef(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false; // ✅ skip first run
      } else {
        fetchData(); // ✅ only run on subsequent changes
      }
    }, 0);

    return () => clearTimeout(timeout); // cleanup
  }, [
    searchA,
    searchB,
    searchC,
    searchAType,
    searchBType,
    searchCType,
    selectedWitness,
    selectedTranscripts,
    selectedWitnessType,
  ]);

    const handleResetSearch = () => {
    setSearchA("");
    setSearchB("");
    setSearchC("");
    setSearchAType("exact");
    setSearchBType("exact");
    setSearchCType("exact");
    setAppliedSearch({
      A: "",
      B: "",
      C: "",
      AType: "exact",
      BType: "exact",
      CType: "exact",
    });
    fetchPaginatedData();
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

  // useEffect(() => {
  //     if (filenameCnt == 0 && witnessNameCnt == 0) {
  //       setTestimonyCnt(0);
  //     } else {
  //       fetchPaginatedData(offset);
  //     }
  //   }, [filenameCnt, witnessNameCnt]);
  
    const getColorFromString = (str) => {
      const colors = [
        "#6c63ff",
        "#ff6b6b",
        "#1abc9c",
        "#e67e22",
        "#f39c12",
        "#3498db",
        "#9b59b6",
        "#2ecc71",
        "#e84393",
        "#fd79a8",
      ];
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    };
  return (
      <Container fluid className=" px-3">
      <Card className="p-3 show-page-sorath">
        {/* Search & Filter */}

        <Row className="mb-3">
          <Col md={6}>
            <h2>Testimoniessss</h2>
{selectedWitness}
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
                      key={`searchC-${opt}`}
                      type="radio"
                      name="searchCType" // ✅ UNIQUE name
                      label={opt}
                      value={opt}
                      checked={searchCType === opt}
                      onChange={(e) => setSearchCType(e.target.value)}
                    />
                  ))}
                </div>
                <div
                  className="mt-3"
                  style={{
                    width: "65px",
                    height: "40px",
                    border: "2px solid #11b3ef",
                    borderRadius: "10px",
                    boxShadow: "4px 4px 10px grey", // blue shadow
                    display: "flex", // 🔹 Flexbox to center content
                    justifyContent: "center", // 🔹 Center horizontally
                    alignItems: "center", // 🔹 Center vertically
                    fontWeight: "bold", // Optional: makes number more prominent
                  }}
                >
                  {filenameCnt}
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
                      key={`searchB-${opt}`}
                      type="radio"
                      name="searchBType" // ✅ UNIQUE name
                      label={opt}
                      value={opt}
                      checked={searchBType === opt}
                      onChange={(e) => {
                        setSearchBType(e.target.value);
                      }}
                    />
                  ))}
                </div>
                <div
                  className="mt-3"
                  style={{
                    width: "65px",
                    height: "40px",
                    border: "2px solid #11b3ef",
                    borderRadius: "10px",
                    boxShadow: "4px 4px 10px grey", // blue shadow
                    display: "flex", // 🔹 Flexbox to center content
                    justifyContent: "center", // 🔹 Center horizontally
                    alignItems: "center", // 🔹 Center vertically
                    fontWeight: "bold", // Optional: makes number more prominent
                  }}
                >
                  {witnessNameCnt}
                </div>
              </Col>
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
                      key={`searchA-${opt}`}
                      type="radio"
                      name="searchAType" // ✅ UNIQUE name
                      label={opt}
                      value={opt}
                      checked={searchAType === opt}
                      onChange={(e) => setSearchAType(e.target.value)}
                    />
                  ))}
                </div>
                <Row>
                  <Col>
                    <div
                      className="mt-3"
                      style={{
                        width: "65px",
                        height: "40px",
                        border: "2px solid #11b3ef",
                        borderRadius: "10px",
                        boxShadow: "4px 4px 10px grey", // blue shadow
                        display: "flex", // 🔹 Flexbox to center content
                        justifyContent: "center", // 🔹 Center horizontally
                        alignItems: "center", // 🔹 Center vertically
                        fontWeight: "bold", // Optional: makes number more prominent
                      }}
                    >
                      {showInitialTestimonyCnt ? initialTestimonyCnt: testimonyCnt}
                    </div>
                  </Col>
                  <Col>
                    <div className="mt-3 d-flex justify-content-end gap-2">
                      {/* <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleResetSearch}
                      >
                        Reset
                      </Button> */}
                      {/* <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          handleSearchSubmit(currentPage, rowsPerPage)
                        }
                      >
                        Apply Search
                      </Button> */}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Collapse>

        {/* Table */}
        <div
          style={{ height: "600px", overflowY: "auto" }}
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <Table responsive bordered className="align-middle rounded-3">
            <thead className="table-sorath-three">
              <tr>
                <th style={{ width: "13%" }}>Comments</th>
                <th style={{ width: "100px" }}>Filename and Cite</th>
                <th style={{ width: "200px" }}>Question and Answers</th>
              </tr>
            </thead>
            <tbody>
              {qaPairs.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <div
                      className="ps-3"
                      style={{ fontSize: "24px", cursor: "pointer" }}
                    >
                      <FaCommentAlt
                        onClick={() => handleShowComments(row.id)}
                      />
                      {row.commenter_emails &&
                        row.commenter_emails.map((commenter, i) => {
                          const initials = commenter.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase();

                          const bgColor = getColorFromString(
                            commenter.email || commenter.name
                          );

                          return (
                            <div
                              onClick={() => handleShowComments(row.id)}
                              className="ms-2"
                              key={i}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                backgroundColor: bgColor,
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                              title={commenter.name}
                            >
                              {initials}
                            </div>
                          );
                        })}
                    </div>
                  </td>
                  <td style={{ width: "100px" }}>
                    {row.transcript_name}
                    <br />
                    {row.cite} {row.id}
                  </td>

                  <td style={{ width: "200px" }}>
                    <div>{highlightText(row.question, searchA)}</div>
                    <br />
                    <div>{highlightText(row.answer, searchA)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Loading Spinner */}
          {loading && <div className="text-center p-2">Loading more...</div>}
        </div>

        {/* Pagination Footer */}
        <Row className="px-1 py-3 align-items-center">
          {/* <Col>
            <span className="text-muted small">
              {qaPairs.length > 0
                ? `${(currentPage - 1) * rowsPerPage + 1}–${
                    (currentPage - 1) * rowsPerPage + qaPairs.length
                  }`
                : "0"}{" "}
              of {totalCount}
            </span>
          </Col> */}

          {/* <Col className="text-center">
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
          </Col> */}

          {/* <Col className="text-end">
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
          </Col> */}
        </Row>
      </Card>
            <Filter
        show={showFilters}
        handleClose={handleCloseFilters}
        testimonyCnt={testimonyCnt}
        // fuzzyTranscripts={fuzzyTranscripts}
        // fuzzyWitnesses={fuzzyWitnesses}
      />
      </Container>
  );
};

export default TestimonySearchPage;
