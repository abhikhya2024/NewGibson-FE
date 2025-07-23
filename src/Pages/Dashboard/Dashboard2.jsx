import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Graph1 from "../../components/Graph1";

const stats = [
  {
    icon: <i className="bi bi-currency-dollar fs-2"></i>,
    title: "Total Sales",
    value: "$1k",
    change: "+8% from yesterday",
    bg: "bg-light-red",
    color: "text-danger",
  },
  {
    icon: <i className="bi bi-cart fs-2"></i>,
    title: "Total Order",
    value: "300",
    change: "+5% from yesterday",
    bg: "bg-light-yellow",
    color: "text-warning",
  },
  {
    icon: <i className="bi bi-box-seam fs-2"></i>,
    title: "Product Sold",
    value: "5",
    change: "+1.2% from yesterday",
    bg: "bg-light-green",
    color: "text-success",
  },
  {
    icon: <i className="bi bi-person-plus fs-2"></i>,
    title: "New Customers",
    value: "8",
    change: "0.5% from yesterday",
    bg: "bg-light-purple",
    color: "text-primary",
  },
];

const Dashboard = () => {
  return (
    <>
    <Container fluid className="sorath-dashboard">
      <Row className="mt-4">
        <Col md={12}>
        <Card className="p-3 sorath-card border-0 rounded-4 card">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-0 title-section">Today's Sales</h5>
              <small className="text-muted">Sales Summary</small>
            </div>
            <Button variant="outline-secondary" size="sm">
              Export
            </Button>
          </div>

          <Row>
            {stats.map((stat, idx) => (
              <Col key={idx} md={6} lg={3} className="mb-3">
                <Card
                  className={`border-0 ${stat.bg} rounded-4 p-3`}
                >
                  <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
                  <h5 className="fw-bold mb-1">{stat.value}</h5>
                  <p className="mb-1">{stat.title}</p>
                  <small className={stat.color}>{stat.change}</small>
                </Card>
              </Col>
            ))}
          </Row>
        </Card></Col>
        
      </Row>

      <Row className="mt-4">
        <Col md={6}>
                <Card className="p-3 sorath-card border-0 rounded-4">
                  <Graph1 />
                </Card>
              </Col>

              <Col md={6}>
                <Card className="p-3 sorath-card border-0 rounded-4">
                  <Graph1 />
                </Card>
              </Col>
      </Row>
    </Container>    
    </>
    
  );
};

export default Dashboard;
