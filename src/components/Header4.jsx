import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { GearFill, BellFill, Search } from "react-bootstrap-icons";

const Header = ({ isOpen, toggle }) => {
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50); // Change this value for sensitivity
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <nav
      id="header-4-1"
      className={`header-sorath-custom ${scrolled ? "scrolled" : ""}`}
    >
      <Container fluid className="py-3">
        <Row className="align-items-center">
          <Col md={4} className="d-flex align-items-center gap-3">
            <button className="toggle-btn-sorath" onClick={toggle}>
              <svg
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 137 106"
              >
                <title>hamburger</title>
                <rect className="humbarg-icon-sorath" width="137" height="10.28" />
                <rect
                  className="humbarg-icon-sorath"
                  y="43.86"
                  width="117.99"
                  height="10.28"
                />
                <rect
                  className="humbarg-icon-sorath"
                  y="87.72"
                  width="91.47"
                  height="10.28"
                />
              </svg>
            </button>
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="User Avatar"
              className="rounded-circle"
              width="40"
              height="40"
            />
            <div>
              <div className="fw-semibold">Hey, Markus</div>
              <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                {today}
              </div>
            </div>
          </Col>

          <Col
            md={8}
            className="d-flex justify-content-end align-items-center gap-3"
          >
            <InputGroup className="search-bar">
              <InputGroup.Text>
                <Search />
              </InputGroup.Text>
              <Form.Control placeholder="Start searching here..." />
            </InputGroup>
            <GearFill size={20} className="text-secondary icon-header" />
            <BellFill size={20} className="text-secondary icon-header" />
          </Col>
        </Row>
      </Container>
    </nav>
  );
};

export default Header;
