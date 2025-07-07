/*eslint-disable*/
import { useState } from "react";
import { NavLink as NavLinkRRD, Link, useLocation } from "react-router-dom";
import { PropTypes } from "prop-types";
import { FaBars } from "react-icons/fa";
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(true);
  const location = useLocation(); // 👈 using hook instead of props.location

  const toggleCollapse = () => {
    setTimeout(()=>{
      setCollapseOpen((prev) => !prev);

    },300)
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  const createLinks = (routes) => {
    return routes.map((prop, key) => (
      <NavItem key={key}>
        <NavLink
          to={prop.layout + prop.path}
          tag={NavLinkRRD}
          onClick={closeCollapse}
          className={activeRoute(prop.layout + prop.path)}
        >
          <i className={prop.icon} />
          {prop.name}
        </NavLink>
      </NavItem>
    ));
  };

  const { routes, logo } = props;

  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <>
      {/* ✅ Hamburger toggle button - always visible */}
      <button
        onClick={toggleCollapse}
        style={{
          position: "fixed",
          top: "10px",
          left: "15px",
          zIndex: 2000,
          background: "none",
          border: "none",
          fontSize: "28px",
          color: "#11bcef",
          cursor: "pointer",
        }}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      {collapseOpen?
      <Navbar
  className={`navbar-vertical fixed-left sidebar-transition ${collapseOpen ? "sidebar-open" : "sidebar-closed"}`}
        expand="md"
        id="sidenav-main"
      >
        <Container fluid>
          {/* Toggler (also needed for smaller screens) */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Logo */}
          {logo ? (
            <Link {...navbarBrandProps} className="navbar-brand pt-0">
              <img
                alt={logo.imgAlt}
                className="navbar-brand-img"
                src={logo.imgSrc}
              />
            </Link>
          ) : null}

          {/* Collapse menu */}
          <Collapse navbar isOpen={collapseOpen}>
            {/* Collapse header on mobile */}
            <div className="navbar-collapse-header d-md-none">
              <Row>
                {logo && (
                  <Col className="collapse-brand" xs="6">
                    {logo.innerLink ? (
                      <Link to={logo.innerLink}>
                        <img alt={logo.imgAlt} src={logo.imgSrc} />
                      </Link>
                    ) : (
                      <a href={logo.outterLink}>
                        <img alt={logo.imgAlt} src={logo.imgSrc} />
                      </a>
                    )}
                  </Col>
                )}
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleCollapse}
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>

            {/* Search */}
            <Form className="mt-4 mb-3 d-md-none">
              <InputGroup className="input-group-rounded input-group-merge">
                <Input
                  aria-label="Search"
                  className="form-control-rounded form-control-prepended"
                  placeholder="Search"
                  type="search"
                />
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <span className="fa fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Form>

            {/* Links */}
            <Nav navbar>{createLinks(routes)}</Nav>
            <hr className="my-3" />
          </Collapse>
        </Container>
      </Navbar>
      :null}
    </>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
