import React, {useState} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const Help = () => {

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <>
          <Modal isOpen={modal} toggle={toggle}>
        <ModalBody>
        <div>
          <b>Fuzzy Filter</b>
          <br/>
          Matches cases like capital, small letters and slight spelling mistakes. 

        </div>
        <br/>
        <div>
          <b>Boolean Filter:</b>
          <ol>
            <li><b>AND:</b> Narrows search (both terms must appear)</li>
            <li><b>OR:</b> Broadens search (either term can appear)</li>
            <li><b>NOT:</b> Excludes a term</li>
            <li><b>( ) :</b> Parentheses = Groups logic for clarity</li>
            <li><b>" " :</b> Quotes = Exact phrase search </li>
            <li><b>* :</b> Asterisk = Wildcard for word variations</li>
            <li><b>/s :</b> Finds both words in the same sentence</li>
          </ol>
        </div>
        <div>
            <b>Keyword filter</b>
            <br/>
            Matches exact keyweord. Its does not detect boolean conditions or fuzzy logic.
        </div>
         
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Close
          </Button>

        </ModalFooter>
      </Modal>
      <span
      style={{
        backgroundColor: "white", // White background
        borderRadius: "50%", // Circle
        lineHeight: "1",
        marginTop: "13px",
        float: "right",
        cursor: "pointer"
      }}
    >
      <i
        className="fa-solid fa-circle-info" onClick={toggle}
        style={{ color: "#000", fontSize: "20px" }} // Icon color and size
      ></i>
    </span>
    </>
    
  );
};

export default Help;
