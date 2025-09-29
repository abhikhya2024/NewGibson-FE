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
  Spinner,
  Modal,
} from "react-bootstrap";
import Filter from "../../components/Filter";
import BASE_URL from "../../api";
import { FaCommentAlt } from "react-icons/fa";
import Comments from "../../components/Comments";
import { useSearchContext } from "../../contexts/SearchContext";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import ClipLoader from "react-spinners/ClipLoader";

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
    fuzzyTranscripts,
    fuzzyWitnesses,
    setFuzzyTranscripts,
    setFuzzyWitnesses,
  } = useSearchContext();
  const [offset, setOffset] = useState(0);
  const rowsPerPage = 100;
  const [limit] = useState(100); // batch size
  const [hasMore, setHasMore] = useState(true); // stop when no more data
  const [sources, setSources] = useState(["default", "farrar"]);
  // Help modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [testimonyId, setTestimonyId] = useState();
  const databases = [
    "DocsSHBLaguenesse",
    "DocsSHBPMProctor",
    "DocsSHBPMCummings",
    "DocsSHBPMRuckdeschel",
    "DocsSHBPMProchaska",
  ];
  // const [selectedTranscripts, setSelectedTranscripts] = useState([]);
  // const [fuzzyTranscripts, setFuzzyTranscripts] = useState([]);
  // const [fuzzyWitnesses, setFuzzyWitnesses] = useState([]);
  const [selectedDatabases, setSelectedDatabases] = useState([]);
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

  const handleDbChange = (data) => {
    setSelectedDatabases(data);
  };

  const handleDownloadExcel = async () => {
    try {
      // Load template
      const response = await fetch("/template.xlsx");
      const buffer = await response.arrayBuffer();

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];

      // Fill data
      qaPairs.forEach((row, index) => {
        const rowIndex = index + 2;

        worksheet.getCell(`A${rowIndex}`).value = row.transcript_name || "";
        worksheet.getCell(`B${rowIndex}`).value = row.question || "";
        worksheet.getCell(`C${rowIndex}`).value = row.answer || "";
        worksheet.getCell(`D${rowIndex}`).value = row.cite || "";
      });

      // Adjust column widths based on content
      worksheet.columns.forEach((col) => {
        let maxLength = 10; // minimum width
        col.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : "";
          if (cellValue.length > maxLength) {
            maxLength = cellValue.length;
          }
        });
        col.width = maxLength + 2; // add padding
      });

      // Save file
      const excelBuffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([excelBuffer]), "testimnony_pairs.xlsx");
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
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

  const [initialTestimonyCnt, setInitialTestimonyCnt] = useState(0);
  const [testimonyCnt, setTestimonyCnt] = useState(0);
  const [showInitialTestimonyCnt, setShowInitialTestimonyCnt] = useState(true);
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

  const fetchTranscripts = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/transcript/`
      );
      const data = await res.json();
      console.log("witnesses", data.transcripts.length);
      setFilenameCnt(data.transcripts.length);
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
        setInitialTestimonyCnt(res.data.total);
        setShowInitialTestimonyCnt(true);
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
    fetchTranscripts();
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

  const [showSearchSection, setShowSearchSection] = useState(true);

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
      setFilenameCnt(res.data.matching_witnesses);
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
    }
  };

  // const handleSearchSubmit = async () => {
  //   setAppliedSearch({
  //     A: searchA,
  //     B: searchB,
  //     C: searchC,
  //     AType: searchAType,
  //     BType: searchBType,
  //     CType: searchCType,
  //   });
  //   console.log("BType", searchBType);
  //   setLoading(true); // start loading spinner

  //   try {
  //     const res = await axios.post(
  //       `${process.env.REACT_APP_PROD_API_URL}/api/testimony/combined-search/`,
  //       {
  //         q1: searchA,
  //         mode1: searchAType,
  //         q2: searchB,
  //         mode2: searchBType,
  //         q3: searchC,
  //         mode3: searchCType,
  //         witness_names: searchB.trim() ? [searchB.trim()] : [], // ✅ FIXED
  //         transcript_names: searchC.trim() ? [searchC.trim()] : [], // ✅ FIXED
  //       },
  //       {
  //         params: {
  //           page: currentPage,
  //           page_size: rowsPerPage,
  //         },
  //       }
  //     );

  //     // Filename count
  //     const uniqueFilenames = new Set(
  //       res.data.results.map((item) =>
  //         item.transcript_name.trim().toLowerCase()
  //       )
  //     );

  //     const uniqueCount = uniqueFilenames.size;
  //     setTotalCount(res.data.count);
  //     setTestimonyCnt(res.data.count)
  //     // Witness name count
  //     const uniqueWitnessNames = new Set(
  //       res.data.results.map((item) => item.witness_name.trim().toLowerCase())
  //     );
  //     const uniqueWitnessCount = uniqueWitnessNames.size;
  //     setWitnessNameCnt(uniqueWitnessCount);

  //     setQaPairs(res.data.results);
  //     setFilenameCnt(uniqueCount);
  //   } catch (err) {
  //     console.error("Failed to fetch paginated data:", err);
  //   } finally {
  //     setLoading(false);
  //   }

  //   // getFuzzyTranscripts(searchC);
  //   // getFuzzyWitnesses(searchB);
  // };

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

  useEffect(() => {
    fetchData();
  }, [
    // searchB,
    // searchA,
    // searchC,
    // searchBType,
    // searchAType,
    // searchCType,
    selectedTranscripts,
    selectedWitness,
  ]);

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
          sources: ["farrar", "default"],
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
      {
        console.log("uniqueFilenames", uniqueFilenames);
      }
      setFilenameCnt(uniqueFilenames.size);

      const uniqueWitnessNames = new Set(
        results.map((item) => item.witness_name.trim().toLowerCase())
      );
      setWitnessNameCnt(uniqueWitnessNames.size);

      setQaPairs(results);
      setTotalCount(res.data.count);
      setShowInitialTestimonyCnt(false);
      setTestimonyCnt(res.data.count);
    } catch (err) {
      console.error("❌ Failed to fetch paginated data:", err);
    } finally {
      setLoading(false);
    }
  };

  const isFirstRender = useRef(true);

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
      <Modal show={show} onHide={handleClose} scrollable centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-bold mb-0">General instructions:</p>
          <p className="mb-2">
            You will need to wait for 2-3 seconds for the search to apply.
          </p>
          <p className="fw-bold mb-1">Searching rules:</p>
          <ol>
            <li className="fw-bold mb-1">Exact search</li>
            <ul>
              <li>
                <p className="mb-1">This will find only "exact" hits.</p>
              </li>
              <li>
                <p className="mb-1">
                  It is not tolerant to{" "}
                  <b>capitalization, spacing or puntuation.</b> This happend in
                  fuzzy search
                </p>
              </li>
              <li>
                <p className="mb-1">
                  It will not find exact hits inside of longer words. That is
                  the behaviour of fuzzy search.
                </p>
              </li>
              <li>
                <p>
                  Wildcards are not permitted. That is available in Boolean
                  search
                </p>
              </li>
            </ul>
            <li className="fw-bold mb-1">Boolean search</li>
            <ul>
              <li>
                <p className="mb-1">
                  If we use <b>AND</b> operator between two words, only those
                  records will be fetched that have both the words
                </p>
                <p>Example: contract AND damages</p>
              </li>
              <li>
                <li>
                  <p className="mb-1">
                    If we use <b>OR</b> operator between two words, those
                    records will be fetched that have either of them or both of
                    the words
                  </p>
                  <p>Example: attorney OR lawyer</p>
                </li>
                <li>
                  <p className="mb-1">
                    If we use <b>NOT</b> operator before a word, those records
                    will be fetched that do not have that word
                  </p>
                  <p>Example: settlement NOT class</p>
                </li>
                <li>
                  <p className="mb-1">
                    Wildcard operator <b>asterisk (*)</b> is allowed.
                  </p>
                  <p>Example: litigat*</p>
                </li>
                <li>
                  <p className="mb-1">
                    <b>Double or single quotes</b> or around the word is
                    allowed.
                  </p>
                  <p>Exapmle: "summary judgment"</p>
                </li>
                <li>
                  <p className="mb-1">
                    <b>Parentheses</b> group logic for clarity
                  </p>
                  <p>Example: (price OR rate) AND fixing</p>
                </li>
              </li>
            </ul>
            <li className="fw-bold mb-1">Fuzzy search</li>
            <ul>
              <li>
                <p className="mb-1">
                  It will match <b>spelling mistakes</b> by 2 characters.
                </p>
              </li>
              <li>
                <p className="mb-1">
                  It is tolerant to{" "}
                  <b>punctuation, capitalization and spacing.</b>
                </p>
              </li>
            </ul>
            <li className="fw-bold mb-1 mt-1">
              Hit count under search options.
            </li>
            <ul>
              <li>
                <p>
                  <b>Search by Filename:</b> Counts the testimony pairs that
                  belong to that specific transcript. It has boolean, fuzzy and
                  exact matching enabled.
                </p>
              </li>
              <li>
                <p>
                  <b>Search by Witness:</b> Counts the testimony pairs that
                  belong to the searched witness. It has boolean, fuzzy and
                  exact matching enabled.
                </p>
              </li>
              <li>
                <p>
                  <b>Search All Testimony:</b> Counts the testimony pairs that
                  belong to the searched keyword. It has boolean, fuzzy and
                  exact matching enabled.
                </p>
              </li>
            </ul>
          </ol>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Card className="p-3 show-page-sorath">
        {/* Search & Filter */}
        <Row className="align-items-center mb-3">
          <Col md={6}>
             <Button
                variant="sucess"
                size="sm"
                onClick={handleDownloadExcel}
                className="filter-sorath-btn"
              >
                <span className="text-white me-2">Download Excel</span>
                <svg
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                  className="filter-sorath"
                >
                  <defs>
                    <style>{".cls-1{fill:none;}"}</style>
                  </defs>
                  <title>search (1)</title>
                  <rect class="cls-1" width="1024" height="1024" />
                  <path d="M254.3,946.75H240.74c-6-5.34-12.75-10-17.78-16.12q-43.85-53.22-87-107c-19.54-24.32-38.68-49-58-73.48V736.56c6-12.53,15-20,29.8-18.79,6.17.5,12.42.08,18.64.08h26.16V554.67c0-30.53,3.81-35,34.11-39.49v-9.79q0-117-.1-233.9c0-10.88,3.45-19.4,11.24-27.12q77.58-77,154.64-154.59c7.45-7.49,15.63-11.06,26.3-11q194.52.28,389,.13c20.94,0,30.56,9.59,30.56,30.5q0,98.31,0,196.61v11.15h9.72c27.13,0,54.25-.07,81.37,0,34.49.13,56.49,22.3,56.51,56.9q0,108.9,0,217.8c0,35.47-22,57.4-57.74,57.5-26.84.08-53.68,0-80.52,0-3,0-5.91.29-9.34.48v11c0,67.23-.45,134.47.28,201.7.21,20.09-9.06,33.71-34,33.61-143.52-.62-287-.31-430.57-.28-11,0-23.46-2.8-32.55,1.45-8.77,4.1-14,15.72-20.89,23.93C272.77,930.68,266.47,941.77,254.3,946.75ZM747.17,649.37H735.36q-146.22,0-292.43,0c-37.42,0-59.13-21.54-59.15-58.74q-.09-107.64.07-215.27A76.25,76.25,0,0,1,386,356.09c6.54-24.5,27-38.93,54.77-38.94q147.91-.09,295.82,0c3.52,0,7-.33,10.37-.5V130.25H399.6v10.6q0,60.18,0,120.35c0,20.57-9.55,30.08-30.05,30.1q-60.61,0-121.21,0H238.18V516.13h73.41c22.69,0,31.6,9,31.6,31.89q0,79.66,0,159.33v10.5c16.09,0,31,.25,46-.08,11.54-.26,20.68,3.64,25.81,14.15,5.27,10.79,2.75,20.66-4.82,29.81-14.41,17.4-28.51,35.06-42.74,52.62-7.92,9.77-15.82,19.55-24.28,30h404Zm148-51.4v-9.05c0-70.33-.15-140.65.19-211,0-8.41-2.59-10.15-10.51-10.14q-219.89.35-439.77,0c-9,0-10.65,2.86-10.62,11.1.31,69.47.18,139,.18,208.42,0,11.2,0,11.22,10.92,11.22q219.47,0,438.93,0C887.78,598.49,891.09,598.17,895.14,598ZM203.45,567.49v9.77q0,81.33,0,162.67c0,18.53-10.21,28.63-28.89,28.77-5.25,0-10.5,0-17.63,0L248,881c30.18-37.3,59.47-73.51,88.74-109.75.27-.33.11-1,.22-2.51H324.59c-23.22,0-32.24-9-32.25-32.29q0-79.23,0-158.44V567.49Zm144.76-398.2-71.14,70.59h71.14Z" />
                  <path d="M491.34,530.85,524,483.23l-27.44-42.35a84.11,84.11,0,0,1-5.81-10.59,21.19,21.19,0,0,1-1.94-8.5,9.88,9.88,0,0,1,3.73-7.51,13.16,13.16,0,0,1,9.09-3.33q6.17,0,9.6,3.63t9.49,13.47l21.88,35.39,23.36-35.39,4.92-7.65a39.62,39.62,0,0,1,3.93-5.27A12.68,12.68,0,0,1,579,412a13.3,13.3,0,0,1,5.42-1,12.72,12.72,0,0,1,9.1,3.33,10.52,10.52,0,0,1,3.53,7.9q0,6.68-7.66,18.1l-28.73,43,30.92,47.62a80.24,80.24,0,0,1,6.06,10.39,18.81,18.81,0,0,1,1.89,7.81,12.3,12.3,0,0,1-1.69,6.36,12.07,12.07,0,0,1-4.77,4.57,14.17,14.17,0,0,1-7,1.69,13.44,13.44,0,0,1-7.06-1.74,15,15,0,0,1-4.67-4.32q-1.79-2.58-6.66-10L542.05,505.2l-27.24,41.56q-3.18,5-4.53,7a25.85,25.85,0,0,1-3.23,3.88,14,14,0,0,1-4.47,3,15.52,15.52,0,0,1-6.07,1.09,12.54,12.54,0,0,1-8.89-3.28q-3.54-3.28-3.53-9.54Q484.09,541.49,491.34,530.85Z" />
                  <path d="M648.63,428.85V534.93h59.85q7.15,0,11,3.48a11.29,11.29,0,0,1,3.83,8.75,11,11,0,0,1-3.78,8.7q-3.78,3.33-11,3.33H637.19q-9.65,0-13.87-4.28t-4.22-13.82V428.85q0-9,4-13.43A13.55,13.55,0,0,1,633.71,411a14.1,14.1,0,0,1,10.79,4.42Q648.63,419.79,648.63,428.85Z" />
                  <path d="M845.68,515.44a42.8,42.8,0,0,1-6.81,23.76q-6.81,10.54-19.93,16.51t-31.12,6q-21.59,0-35.6-8.15a47.44,47.44,0,0,1-16.15-15.66q-6.23-9.79-6.22-19a12.91,12.91,0,0,1,13.23-13,11.21,11.21,0,0,1,7.9,3,23.6,23.6,0,0,1,5.52,8.85,58.85,58.85,0,0,0,6,11.63,24.4,24.4,0,0,0,9.1,7.71q5.86,3,15.41,3,13.13,0,21.33-6.12t8.2-15.26a16.15,16.15,0,0,0-4.43-11.78,28.6,28.6,0,0,0-11.43-6.91q-7-2.39-18.74-5.07a137.5,137.5,0,0,1-26.3-8.6,42.5,42.5,0,0,1-16.8-13.42q-6.21-8.5-6.21-21.13a36.22,36.22,0,0,1,6.56-21.37q6.56-9.34,19-14.37t29.23-5q13.43,0,23.21,3.33a49.06,49.06,0,0,1,16.26,8.85,36.84,36.84,0,0,1,9.44,11.58,26.73,26.73,0,0,1,3,11.83,14,14,0,0,1-3.73,9.5,11.89,11.89,0,0,1-9.3,4.22q-5.07,0-7.7-2.53a34,34,0,0,1-5.72-8.3,37.65,37.65,0,0,0-9.54-12.88q-5.58-4.62-17.9-4.62-11.43,0-18.44,5T760,449a12.21,12.21,0,0,0,2.38,7.55,20,20,0,0,0,6.57,5.47,43.69,43.69,0,0,0,8.45,3.58q4.27,1.29,14.11,3.78a221.75,221.75,0,0,1,22.33,6.36,68.1,68.1,0,0,1,17,8.45,34.85,34.85,0,0,1,10.93,12.58Q845.68,504.41,845.68,515.44Z" />
                </svg>
              </Button>
          </Col>
          <Col md={6}>
            <div className="d-flex justify-content-end align-items-end gap-3">

              <Form.Group>
              {/* <Form.Label className="fw-semibold">Database</Form.Label> */}
              <Dropdown>
                <Dropdown.Toggle
                  
                  className="filter-sorath-btn"
                >
                  {selectedDatabases.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {selectedDatabases.map((db, idx) => (
                        <span key={idx} className="badge bg-primary">
                          {db.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "Select Database(s)"
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {databases.map((option) => (
                    <Form.Check
                      key={option.id}
                      type="checkbox"
                      label={option}
                      className="px-3 py-1"
                      style={{ whiteSpace: "nowrap" }}
                      checked={selectedDatabases.some(
                        (db) => db.id === option.id
                      )}
                      onChange={() => handleDbChange(option)}
                      onClick={(e) => e.stopPropagation()} // 🔒 Prevent dropdown from closing
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowSearchSection((prev) => !prev)}
                className="filter-sorath-btn"
              >
                <svg
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                  className="filter-sorath"
                >
                  <defs>
                    <style>{".cls-1{fill:none;}"}</style>
                  </defs>
                  <title>search (1)</title>
                  <path d="M466.54,73.34c17.69,2.79,35.57,4.75,53.06,8.5,139.48,30,249.25,144.44,272.53,284.87,17.38,104.81-7.45,199.16-73,282.78-1.4,1.78-2.7,3.62-4.37,5.85L788.43,732q66.48,69.13,133,138.28c19.49,20.33,19.67,49.13.69,67.36-19.15,18.38-47.53,17.12-67.2-3.3Q753.88,829.44,653,724.44c-2-2.05-3.76-4.27-6-6.84-6.74,4.26-12.89,8.23-19.12,12.06C423,855.55,151.71,741.52,98.41,507.12A354.42,354.42,0,0,1,304.62,101.8a340.69,340.69,0,0,1,109.06-27,48,48,0,0,0,6.6-1.43ZM443.76,689.23c144.91-.51,262-118.13,261.34-262.42-.71-145-118-261.58-262.7-261C298.21,166.36,181.46,284,181.91,428.17S300,689.74,443.76,689.23Z" />
                  <rect className="cls-1" width="1024" height="1024" />
                </svg>
              </Button>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleShowFilters}
                className="filter-sorath-btn"
              >
                <svg
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                  className="filter-sorath"
                >
                  <defs>
                    <style>{".cls-1{fill:none;}"}</style>
                  </defs>
                  <title>search (1)</title>
                  <rect class="cls-1" width="1024" height="1024" />
                  <path d="M512.2,77c106.49,0,213-.62,319.47.31,42.7.37,75.17,21.38,94,59.68,19.5,39.59,15.88,79.09-11.63,113.59C881.87,291,847.24,329.49,813.6,368.76q-75.69,88.37-151.54,176.6c-11.78,13.67-17,29-16.93,47,.29,71.11-.19,142.22.23,213.33.25,41.18-17.27,70.34-54.65,88.11-29.48,14-58.37,29.27-87.73,43.56-61.69,30-125.68-9.77-125.87-78.48q-.37-131.76.13-263.52c.11-20.59-6.46-37.43-19.79-52.9Q234.6,399.85,112.39,256.7C58.36,193.25,88.77,99,169,80.37c10.25-2.38,21.11-2.94,31.69-3q155.75-.31,311.49-.13Zm-.72,73.3q-155.78,0-311.56-.09c-16.91,0-31,4.42-38.5,20.79-7.35,16-1.43,29.11,9.31,41.6,80.09,93.14,159.59,186.8,240.14,279.54,27.1,31.21,40,65.86,39.51,107.19-1,85.56-.32,171.15-.27,256.73,0,18,7.44,22.52,23.59,14.48,28.21-14,56.2-28.6,84.69-42.07,10.54-5,14.08-11.71,14-23.08-.41-70.74.11-141.49-.34-212.23-.22-35.8,10.54-67.12,33.89-94.28q83.31-96.9,166.41-194c26.73-31.18,53.36-62.45,80.24-93.52,10.57-12.22,15.32-25.42,8.06-40.81S840.3,150,824.18,150.3c-2.66.06-5.33,0-8,0Z" />
                </svg>
              </Button>

             
            </div>
          </Col>
        </Row>

        {/* Conditional Search Section */}

        <Collapse in={showSearchSection}>
          <div className="p-3 bg-light rounded border mb-3">
            <Row>
              {/* Search C */}
              <Col md={4}>
                <Form.Label>Search by Filename</Form.Label>
                <div className="d-flex align-item-center gap-3">
                  <Form.Control
                    value={searchC}
                    onChange={(e) => {
                      // fetchData();
                      setSearchC(e.target.value);
                    }}
                    placeholder="Search by Filename"
                    className="show-page-sorath"
                  />

                  <div
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
                </div>

                <div className="mt-2 d-flex gap-2">
                  {["fuzzy", "boolean", "exact"].map((opt) => (
                    <Form.Check
                      key={`searchC-${opt}`}
                      type="radio"
                      name="searchCType" // ✅ UNIQUE name
                      label={opt}
                      value={opt}
                      checked={searchCType === opt}
                      onChange={(e) => {
                        // fetchData();
                        setSearchCType(e.target.value);
                      }}
                    />
                  ))}{" "}
                  <i
                    onClick={handleShow}
                    style={{ cursor: "pointer" }}
                    className="bi bi-question-circle-fill"
                  ></i>{" "}
                </div>
              </Col>
              {/* Search B */}
              <Col md={4}>
                <Form.Label>Search by Witness</Form.Label>
                <div className="d-flex align-item-center gap-3">
                  <Form.Control
                    value={searchB}
                    onChange={(e) => {
                      setSearchB(e.target.value);
                    }}
                    placeholder="Search by Witness"
                    className="show-page-sorath"
                  />

                  <div
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
                </div>

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

                        // fetchData()
                      }}
                    />
                  ))}{" "}
                  <i
                    onClick={handleShow}
                    style={{ cursor: "pointer" }}
                    className="bi bi-question-circle-fill"
                  ></i>{" "}
                </div>
              </Col>
              {/* Search A */}
              <Col md={4}>
                <Form.Label>Search All Testimony</Form.Label>
                <div className="d-flex align-item-center gap-3">
                  <Form.Control
                    value={searchA}
                    onChange={(e) => {
                      // fetchData();
                      setSearchA(e.target.value);
                    }}
                    placeholder="Search by test"
                    className="show-page-sorath"
                  />

                  <div
                    style={{
                      // width: "100px",
                      // height: "40px",
                      padding: "7px",
                      border: "2px solid #11b3ef",
                      borderRadius: "10px",
                      boxShadow: "4px 4px 10px grey", // blue shadow
                      display: "flex", // 🔹 Flexbox to center content
                      justifyContent: "center", // 🔹 Center horizontally
                      alignItems: "center", // 🔹 Center vertically
                      fontWeight: "bold", // Optional: makes number more prominent
                    }}
                  >
                    {showInitialTestimonyCnt
                      ? initialTestimonyCnt
                      : testimonyCnt}
                  </div>

                  <Button variant="secondary" onClick={()=>{fetchData()}}>
                    Search
                  </Button>
                  <Button variant="secondary" onClick={handleResetSearch}>
                    Reset
                  </Button>
                </div>

                <div className="mt-2 d-flex gap-2">
                  {["fuzzy", "boolean", "exact"].map((opt) => (
                    <Form.Check
                      key={`searchA-${opt}`}
                      type="radio"
                      name="searchAType" // ✅ UNIQUE name
                      label={opt}
                      value={opt}
                      checked={searchAType === opt}
                      onChange={(e) => {
                        fetchData();
                        setSearchAType(e.target.value);
                      }}
                    />
                  ))}{" "}
                  <i
                    onClick={handleShow}
                    style={{ cursor: "pointer" }}
                    className="bi bi-question-circle-fill"
                  ></i>{" "}
                </div>
              </Col>
            </Row>
          </div>
        </Collapse>

        <div
          class="container-fluid"
          style={{ height: "600px", overflowY: "auto" }}
          // ref={scrollContainerRef}
          // onScroll={handleScroll}
        >
          {/* <Button
            variant="success"
            className="mb-3"
            onClick={handleDownloadExcel}
          >
            Download Excel
          </Button> */}
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <div style={{ textAlign: "center", padding: "20px" }}>
                <ClipLoader color="#007bff" size={50} /> {/* Blue spinner */}
              </div>
            </div>
          ) : (
            <Table
              responsive
              bordered
              className="align-middle rounded-3 qa-table"
            >
              <colgroup>
                <col style={{ width: "20%" }} /> {/* Filename and Cite */}
                <col style={{ width: "55%" }} /> {/* Question and Answers */}
                <col style={{ width: "25%" }} /> {/* Comments */}
              </colgroup>

              <thead className="table-sorath-three">
                <tr>
                  <th>Filename and Cite</th>
                  <th>Question and Answers</th>
                  <th>Comments</th>
                </tr>
              </thead>

              <tbody className="t-body">
                {qaPairs.map((row) => (
                  <tr key={row.id ?? row.transcript_name}>
                    <td>
                      {row.transcript_name}
                      <br />
                      {row.cite}
                    </td>

                    <td>
                      <div className="truncate-wrap">
                        {highlightText(row.question, searchA)}
                      </div>
                      <br />
                      <div className="truncate-wrap">
                        {highlightText(row.answer, searchA)}
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        {/* Comment Icon */}
                        <FaCommentAlt
                          size={22}
                          onClick={() => handleShowComments(row.id)}
                          style={{ cursor: "pointer", marginTop: "4px" }}
                        />

                        {/* Comments in a column */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {row.comments &&
                            row.comments.map((commenter, i) => {
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
                                  key={i}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <div
                                    onClick={() => handleShowComments(row.id)}
                                    className="ms-2"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 32,
                                      height: 32,
                                      borderRadius: "50%",
                                      backgroundColor: bgColor,
                                      color: "white",
                                      fontWeight: "bold",
                                      fontSize: "14px",
                                      flexShrink: 0,
                                    }}
                                    title={commenter.name}
                                  >
                                    {initials}
                                  </div>
                                  <p style={{ margin: 0 }}>
                                    {commenter.content}
                                  </p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {/* Loading Spinner */}
          {/* {loading && <div className="text-center p-2">Loading more...</div>} */}
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

      <Comments
        showComments={showComments}
        handleClose={handleCloseComments}
        testimonyId={testimonyId}
      ></Comments>
    </Container>
  );
};

export default TestimonySearchPage;
