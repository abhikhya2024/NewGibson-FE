/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState } from "react";
// reactstrap components
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Container,
  Row,
  Col,
  Input,
} from "reactstrap";
import Callouts from "components/Callouts/Callouts";
import WitnessFilter from "components/Filters/Filters";

const Header = (props) => {
  const { numRecords } = props;
  const [selected1, setSelected1] = useState("Adverse");
  const [selected2, setSelected2] = useState("Expert");

  const handleChange1 = (e) => {
    setSelected1(e.target.value);
  };

  const handleChange2 = (e) => {
    setSelected2(e.target.value);
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col>{/* <WitnessFilter/> */}</Col>
            </Row>
            <Row>
              <Col lg="6" xl="4">
                <Callouts numRecords={numRecords} />
              </Col>
              <Col lg="6" xl="3">
                <h3 style={{ color: "white" }}>Witness Alignment</h3>
                <Form>
                  <FormGroup tag="fieldset">
                    <div className="d-flex gap-4">
                      {["Adverse", "Neutral", "Aligned"].map((option) => (
                        <FormGroup check key={option}>
                          <Label
                            check
                            className="d-flex align-items-center mr-3 mt-1 text-white"
                          >
                            <Input
                              type="radio"
                              name="search-mode"
                              value={option}
                              checked={selected1 === option}
                              onChange={(e) => handleChange1(e)}
                              style={{
                                width: "15px",
                                height: "15px",
                                accentColor: "#fb6340",
                              }}
                            />
                            <span
                              style={{ marginLeft: "10px", fontSize: "1.1rem" }}
                            >
                              {option}
                            </span>
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                  </FormGroup>
                </Form>
              </Col>
              <Col lg="6" xl="3" className="pl-5 ml-5">
                <h3 style={{ color: "white" }}>Witness Type</h3>
                <Form>
                  <FormGroup tag="fieldset">
                    <div className="d-flex gap-4">
                      {["Expert", "Corporate", "Fact"].map((option) => (
                        <FormGroup check key={option}>
                          <Label
                            check
                            className="d-flex align-items-center mr-3 mt-1 text-white"
                          >
                            <Input
                              type="radio"
                              name="search-mode"
                              value={option}
                              checked={selected2 === option}
                              onChange={(e) => handleChange2(e)}
                              style={{
                                width: "15px",
                                height: "15px",
                                accentColor: "#fb6340",
                              }}
                            />
                            <span
                              style={{ marginLeft: "10px", fontSize: "1.1rem" }}
                            >
                              {option}
                            </span>
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
