import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiFilter } from 'react-icons/fi';
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
  Badge
} from 'react-bootstrap';
import Filter from '../../components/Filter';

const EnhancedTable = () => {
  const [loading, setLoading] = useState(false);
  const [qaPairs, setQaPairs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [showFilters, setShowFilters] = useState(false);

  const handleShowFilters = () => setShowFilters(true);
  const handleCloseFilters = () => setShowFilters(false);

  const fetchPaginatedData = async (page = 1, pageSize = rowsPerPage) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/testimony/`, {
        params: {
          page,
          page_size: pageSize,
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageSizeChange = (size) => {
    setRowsPerPage(size);
    setCurrentPage(1); // reset to first page
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <Container fluid className="py-4 px-3">
      <Card className="p-4 show-page-sorath">
        <h2 className="mb-4">Testimonies</h2>

        {/* Search & Filter */}
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
              className='show-page-sorath'
            />
          </Col>
          <Col md={6} className="d-flex justify-content-end">
            <Button variant="outline-primary" size="sm" onClick={handleShowFilters} className='filter-sorath-btn'>
              <FiFilter className="filter-sorath" />
            </Button>
          </Col>
        </Row>

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
                  {row.transcript_name}<br />{row.cite}
                </td>
                <td style={{ width: "100px" }}>
                  {row.question}<br />{row.answer}
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
                ? `${(currentPage - 1) * rowsPerPage + 1}–${(currentPage - 1) * rowsPerPage + qaPairs.length}`
                : '0'} of {totalCount}
            </span>
          </Col>

          <Col className="text-center">
            <DropdownButton
              title={`Rows per page: ${rowsPerPage}`}
              variant="outline-secondary"
              className="custom-rows-dropdown"
              size="sm"
            >
              {[5, 10, 15, 20, 50, 100].map(n => (
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
              <span className="fw-semibold d-flex align-center">{currentPage}</span>
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
