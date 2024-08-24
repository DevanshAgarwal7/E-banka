import React, { useContext, useEffect, useRef, useState } from "react";
import '../../styling/ViewStatementModal.css';
import Modal from 'react-bootstrap/Modal';
import AccountContext from "../../context/AccountContext";
import UserContext from "../../context/UserContext";
import {useReactToPrint} from "react-to-print";
import { viewTransactionStatementsService } from "../../services/TransactionService";
import UserIdleChecker from "../../util/UserIdlechecker";

function ViewStatementModal({value}) {

    const { accountInformation } = useContext(AccountContext);
    const { userInfo } = useContext(UserContext);

    const [transactionStatements, setTransactionStatments] = useState([]);

    useEffect(() => {
        const getAllTransactions = async () => {
            if (value.modalShowStatus) {
                const response = await viewTransactionStatementsService({ accountNumber: accountInformation?.accountNumber });
                if (Array.isArray(response.data)) {
                    setTransactionStatments(response.data);
                } else {
                    setTransactionStatments([]);
                }
            }
        };

        getAllTransactions();
    }, [value.modalShowStatus, accountInformation?.accountNumber]);

    const componentDownloadableReference = useRef(null);
    const handleDownloadStatements =  useReactToPrint({
        content: () => componentDownloadableReference.current,
        documentTitle: 'Bank_Statement',
        pageStyle: ''
    });

    const handleClose = () => {
        value.setHide(false);
    }


    return ( 
        <React.Fragment>
            <div className="view_statement_component">
                <Modal show={value.modalShowStatus}  onHide={handleClose} size="xl" centered>
                    <Modal.Header closeButton>
                    <Modal.Title>{value.modalOperation}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{height: "70vh", overflowY: "auto"}}>
                    <div className="d-flex flex-row mb-3 justify-content-end align-items-center flex-wrap">
                        <div className="p-2">
                            <button type="submit" className="btn btn-primary" onClick={handleDownloadStatements} disabled={transactionStatements.length === 0}>Download Statements</button>
                        </div>
                    </div>
                    <div ref={componentDownloadableReference}>
                        <div className="d-flex flex-row justify-content-start align-items-center flex-wrap">
                            <div className="p-2">
                                <p><strong> Account Number: </strong> {accountInformation != null && accountInformation?.accountNumber}</p>
                                <p><strong>User ID: </strong> {userInfo != null && userInfo?.userInfo.userId}</p>
                            </div>
                        </div>
                        <div className="d-flex flex-row mb-3 justify-content-center align-items-center flex-wrap">
                                <div className="p-2">
                                    <div className="details_table mt-5 px-5">
                                    <table className="table table-striped table-bordered table-responsive">
                                        <thead className="text-center">
                                            <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Transaction ID</th>
                                            <th scope="col">Account Number</th>
                                            <th scope="col">Transaction Type</th>
                                            <th scope="col">Transaction Amount</th>
                                            <th scope="col">Transaction Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-group-divider text-center">
                                            { transactionStatements.map((statement, index) => {
                                                return (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{statement?.transactionId}</td>
                                                    <td>{statement?.accountNumber}</td>
                                                    <td>{statement?.transactionType}</td>
                                                    <td>{statement?.tranactionAmount}</td>
                                                    <td>{statement?.tranasctionDate}</td>
                                                </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                        </div>
                    </div>
                    </Modal.Body>
                </Modal>

            </div>
        </React.Fragment>
     );
}

export default ViewStatementModal;