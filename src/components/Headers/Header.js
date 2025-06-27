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

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import Callouts from "components/Callouts/Callouts";
import WitnessFilter from "components/Filters/Filters";

const Header = (props) => {
  const {numRecords} = props
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col>
              {/* <WitnessFilter/> */}
              </Col>
            </Row>
            <Row>
              <Col lg="6" xl="3">
              <Callouts numRecords={numRecords}/>
               
              </Col>
              <Col lg="6" xl="3">
                
              </Col>
              <Col lg="6" xl="3">
            
              </Col>
              <Col lg="6" xl="3">

              </Col>
            </Row>
            <Row>
              <Col>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
