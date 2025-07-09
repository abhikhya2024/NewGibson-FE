import React, { useState } from "react";
import { Collapse } from "react-bootstrap";
import Filter from "../../components/Filter";
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
  Image,
} from "react-bootstrap";

const EnhancedTable = () => {
  const allData = [
    {
      name: "Ralph Edwards",
      phone: "(405) 555-0128",
      status: "Open",
      rate: 78.0,
      balance: -105.55,
      deposit: 293.01,
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Floyd Miles",
      phone: "(480) 555-0103",
      status: "Paid",
      rate: 40.0,
      balance: 275.43,
      deposit: 710.68,
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Darlene Robertson",
      phone: "(808) 555-0111",
      status: "Open",
      rate: 77.0,
      balance: -778.35,
      deposit: 169.43,
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      name: "Albert Flores",
      phone: "(316) 555-0116",
      status: "Inactive",
      rate: 85.0,
      balance: 928.41,
      deposit: 779.58,
      image: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      name: "Devon Lane",
      phone: "(217) 555-0113",
      status: "Paid",
      rate: 56.0,
      balance: 256.35,
      deposit: 896.65,
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    status: true,
    rate: true,
    balance: true,
    deposit: true,
    actions: true,
  });

  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [showFilters, setShowFilters] = useState(false);
  const handleCloseFilters = () => setShowFilters(false);
  const handleShowFilters = () => setShowFilters(true);

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
    AType: "All",
    BType: "All",
    CType: "All",
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchSubmit = () => {
    setAppliedSearch({
      A: searchA,
      B: searchB,
      C: searchC,
      AType: searchAType,
      BType: searchBType,
      CType: searchCType,
    });
  };

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

  const getFilteredSortedData = () => {
    let filtered = allData.filter((item) => {
      const globalMatch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.toLowerCase().includes(search.toLowerCase());

      const aMatch = matchType(item.name, appliedSearch.A, appliedSearch.AType);
      const bMatch = matchType(item.phone, appliedSearch.B, appliedSearch.BType);
      const cMatch = matchType(item.status, appliedSearch.C, appliedSearch.CType);

      return globalMatch && aMatch && bMatch && cMatch;
    });

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (typeof aVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else {
          return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
      });
    }

    return filtered;
  };

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <Badge bg="success">Paid</Badge>;
      case "Open":
        return <Badge bg="primary">Open</Badge>;
      case "Inactive":
        return <Badge bg="secondary">Inactive</Badge>;
      default:
        return <Badge bg="light">{status}</Badge>;
    }
  };

  const filteredData = getFilteredSortedData();
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Container fluid className="py-4 px-3">
      <Card className="p-4 show-page-sorath">
        <h2 className="mb-4">Table</h2>

        {/* Top bar */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search customer or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="show-page-sorath"
            />
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

            <DropdownButton
              variant="outline-secondary"
              title="Columns"
              size="sm"
              className="colum-3-sorath ms-3"
            >
              {Object.keys(visibleColumns).map((col) => (
                <Form.Check
                  key={col}
                  type="checkbox"
                  className="px-3"
                  label={col.toUpperCase()}
                  checked={visibleColumns[col]}
                  onChange={() => toggleColumn(col)}
                />
              ))}
            </DropdownButton>
          </Col>
        </Row>

        {/* Conditional Search Section */}
        
          <Collapse in={showSearchSection}>
          <div className="p-3 bg-light rounded border mb-3">
            <Row>
              {/* Search A */}
              <Col md={4}>
                <Form.Label>Search A (Name)</Form.Label>
                <Form.Control
                  value={searchA}
                  onChange={(e) => setSearchA(e.target.value)}
                  placeholder="Search by name"
                  className="show-page-sorath"
                />
                <div className="mt-2 d-flex gap-2">
                  {["All", "Exact", "Partial"].map((opt) => (
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
                <Form.Label>Search B (Phone)</Form.Label>
                <Form.Control
                  value={searchB}
                  onChange={(e) => setSearchB(e.target.value)}
                  placeholder="Search by phone"
                  className="show-page-sorath"
                />
                <div className="mt-2 d-flex gap-2">
                  {["All", "Exact", "Partial"].map((opt) => (
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
                <Form.Label>Search C (Status)</Form.Label>
                <Form.Control
                  value={searchC}
                  onChange={(e) => setSearchC(e.target.value)}
                  placeholder="Search by status"
                  className="show-page-sorath" 
                />
                <div className="mt-2 d-flex gap-2">
                  {["All", "Exact", "Partial"].map((opt) => (
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
              <Button variant="primary" size="sm" onClick={handleSearchSubmit}>
                Apply Search
              </Button>
            </div>
          </div>
          </Collapse>

        {/* Table */}
        <Table responsive bordered className="align-middle text-nowrap rounded-3">
          <thead className="table-sorath-three">
            <tr>
              {visibleColumns.name && (
                <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                  CUSTOMER{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
              )}
              {visibleColumns.status && (
                <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                  STATUS{" "}
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
              )}
              {visibleColumns.rate && (
                <th onClick={() => handleSort("rate")} style={{ cursor: "pointer" }}>
                  RATE{" "}
                  {sortConfig.key === "rate" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
              )}
              {visibleColumns.balance && (
                <th onClick={() => handleSort("balance")} style={{ cursor: "pointer" }}>
                  BALANCE{" "}
                  {sortConfig.key === "balance" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
              )}
              {visibleColumns.deposit && (
                <th onClick={() => handleSort("deposit")} style={{ cursor: "pointer" }}>
                  DEPOSIT{" "}
                  {sortConfig.key === "deposit" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
              )}
              {visibleColumns.actions && <th>ACTIONS</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx}>
                {visibleColumns.name && (
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Image
                        src={row.image}
                        roundedCircle
                        width={36}
                        height={36}
                        alt={row.name}
                      />
                      <div>
                        <strong>{row.name}</strong>
                        <br />
                        <small className="text-muted">{row.phone}</small>
                      </div>
                    </div>
                  </td>
                )}
                {visibleColumns.status && <td>{getStatusBadge(row.status)}</td>}
                {visibleColumns.rate && <td>${row.rate.toFixed(2)} USD</td>}
                {visibleColumns.balance && (
                  <td style={{ color: row.balance < 0 ? "red" : "green" }}>
                    ${row.balance.toFixed(2)} USD
                  </td>
                )}
                {visibleColumns.deposit && <td>${row.deposit.toFixed(2)} USD</td>}
                {visibleColumns.actions && (
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm">View</Button>
                      <Button variant="outline-success" size="sm">Edit</Button>
                      <Button variant="outline-danger" size="sm">Delete</Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <Row className="px-1 py-3 align-items-center">
          <Col>
            <span className="text-muted small">
              {paginatedData.length > 0
                ? `${(currentPage - 1) * rowsPerPage + 1}–${(currentPage - 1) * rowsPerPage + paginatedData.length}`
                : "0"} of {filteredData.length}
            </span>
          </Col>
          <Col className="text-center">
            <DropdownButton
              title={`Rows per page: ${rowsPerPage}`}
              variant="outline-secondary"
              className="custom-rows-dropdown"
              size="sm"
            >
              {[5, 10, 15, 20].map((n) => (
                <Dropdown.Item
                  key={n}
                  onClick={() => {
                    setRowsPerPage(n);
                    setCurrentPage(1);
                  }}
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

      <Filter show={showFilters} handleClose={handleCloseFilters} />
    </Container>
  );
};

export default EnhancedTable;
