import React from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

function SuccessMessage(prop) {
    return ( 
        <React.Fragment>
            <div className="d-flex flex-row mb-3 justify-content-center align-items-center flex-wrap">
            <ToastContainer className="p-3" position='middle-center'>
                <Row>
                    <Col md={12} className="mb-2">
                        <Toast show={prop.show}>
                        <Toast.Header>
                            <strong className="me-auto danger" style={{color: "green"}}>{prop.heading}!!</strong>
                        </Toast.Header>
                        <Toast.Body>{prop.message}</Toast.Body>
                        </Toast>
                    </Col>
                </Row>
            </ToastContainer>
            </div>
        </React.Fragment>
     );
}

export default SuccessMessage;