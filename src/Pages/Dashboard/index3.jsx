import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Filter from '../../components/Filter';
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
  Badge,
  Image
} from 'react-bootstrap';

const EnhancedTable = () => {
    const [loading, setLoading] = useState(false);
  const [qaPairs, setQaPairs] = useState([]);

  const fetchPaginatedData = async () => {

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/testimony/`
      );
      setQaPairs(res.data.results);

    } catch (err) {
      console.error("Failed to fetch paginated data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    console.log("useeffect")
    fetchPaginatedData()
  },[])
  const allData = [
    {
      name: 'Ralph Edwards',
      phone: '(405) 555-0128',
      status: 'Open',
      rate: 78.0,
      balance: -105.55,
      deposit: 293.01,
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      name: 'Floyd Miles',
      phone: '(480) 555-0103',
      status: 'Paid',
      rate: 40.0,
      balance: 275.43,
      deposit: 710.68,
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      name: 'Darlene Robertson',
      phone: '(808) 555-0111',
      status: 'Open',
      rate: 77.0,
      balance: -778.35,
      deposit: 169.43,
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
      name: 'Albert Flores',
      phone: '(316) 555-0116',
      status: 'Inactive',
      rate: 85.0,
      balance: 928.41,
      deposit: 779.58,
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      name: 'Devon Lane',
      phone: '(217) 555-0113',
      status: 'Paid',
      rate: 56.0,
      balance: 256.35,
      deposit: 896.65,
      image: 'https://randomuser.me/api/portraits/men/5.jpg',
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

  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [showFilters, setShowFilters] = useState(false);
const handleCloseFilters = () => setShowFilters(false);
const handleShowFilters = () => setShowFilters(true);
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getFilteredSortedData = () => {
    // let filtered = qaPairs.filter(item =>
    //   item.name.toLowerCase().includes(search.toLowerCase()) ||
    //   item.phone.toLowerCase().includes(search.toLowerCase())
    // );

    if (sortConfig.key) {
      qaPairs = [...qaPairs].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (typeof aVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        } else {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
      });
    }

    return qaPairs;
  };

  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <Badge bg="success">Paid</Badge>;
      case 'Open': return <Badge bg="primary">Open</Badge>;
      case 'Inactive': return <Badge bg="secondary">Inactive</Badge>;
      default: return <Badge bg="light">{status}</Badge>;
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
      <h2 className="mb-4">Testimonies</h2>
      {/* Top Search & Columns */}
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
          <DropdownButton variant="outline-secondary" title="Columns" size="sm" className='colum-3-sorath ms-3' >
            {Object.keys(visibleColumns).map((col) => (
              <Form.Check
                key={col}
                type="checkbox"
                className="px-3 "
                label={col.toUpperCase()}
                checked={visibleColumns[col]}
                onChange={() => toggleColumn(col)}
                
              />
            ))}
          </DropdownButton>
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
    {paginatedData.map((row, idx) => (
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

      {/* Footer Pagination */}
      <Row className="px-1 py-3 align-items-center">
        <Col>
          <span className="text-muted small"  >
            {paginatedData.length > 0
              ? `${(currentPage - 1) * rowsPerPage + 1}–${(currentPage - 1) * rowsPerPage + paginatedData.length}`
              : '0'} of {filteredData.length}
          </span>
        </Col>
        <Col className="text-center" >
         <DropdownButton
  title={`Rows per page: ${rowsPerPage}`}
  variant="outline-secondary"
  className="custom-rows-dropdown" 
  size="sm"
>
  {[5, 10, 15, 20].map(n => (
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
