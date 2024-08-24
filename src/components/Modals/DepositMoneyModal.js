import React, { useState, useContext } from "react";
import Modal from 'react-bootstrap/Modal';
import UserContext from "../../context/UserContext";
import AccountContext from "../../context/AccountContext";
import { transactionService } from "../../services/TransactionService";
import AlertMessage from "../AlertMessage";
import SuccessMessage from "./SuccessMessage";
import UserIdleChecker from "../../util/UserIdlechecker";

function DepositMoneyModal({value}) {

    const { accountInformation } = useContext(AccountContext);
    const { userInfo } = useContext(UserContext);
    const initialState = {
        accountNumber: accountInformation?.accountNumber,
        userId: userInfo?.userInfo.userId,
        transactionType: "DEPOSIT_MONEY",
        transactionAmount: ''

    }
    const [depositMoneyInfo, setDepositMoneyInfo] = useState(initialState)

    const handleChange = (event) => {
        event.preventDefault();
        setDepositMoneyInfo(prevState => ({
            ...prevState,
            [event.target.name] : event.target.value
        }));
    }

    const[isDetailsValid, setIsDetailsValid] = useState(false);
    const[errorAlertState, setErrorAlertState] = useState({show: false, heading: "", message: ""});
    const setErrorWarning = (warningMessage) => {
      setErrorAlertState({show: true, heading: "Error", message: warningMessage});
      setTimeout(() => {
        setErrorAlertState({show: false, heading: "", message: ""});
      }, 2000);
    }
    const handleAmountValidation = (event) => {
        if (!/^\d*\.?\d*$/.test(event.target.value) || event.target.value === '') {
            setIsDetailsValid(false);
            setErrorWarning('Please Enter Only Number.');
          } else if(parseFloat(event.target.value) <= 0){
            setIsDetailsValid(false);
            setErrorWarning('Please Enter Amount Greater Than 0.');
          } else {
            setDepositMoneyInfo(prevState => ({
                ...prevState,
                [event.target.name]: parseFloat(event.target.value)
            }));
            setIsDetailsValid(true);
          }
    }

    const[successAlertState, setSuccessAlertState] = useState({show: false, heading: "", message: ""});
    const setSuccessMessage = (successMessage) => {
        setSuccessAlertState({show: true, heading: "Success", message: successMessage});
      setTimeout(() => {
        setSuccessAlertState({show: false, heading: "", message: ""});
        handleClose();
      }, 4000);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await transactionService(depositMoneyInfo);
        if(response && response.data.transactionId !== null){
            setSuccessMessage("Money Deposit Successfully, Transaction Id: " +  response.data.transactionId);
        } else if(response && response.data.transactionId === null) {
            setErrorWarning("Your Deposit Money Transaction Failed, Try After Some Time.");
            setTimeout(() => {
                handleClose();
            }, 4000);
        }
    }

    const handleClose = () => {
        value.setHide(false);
        setDepositMoneyInfo(initialState);
    }


    return ( 
        <React.Fragment>
            <div className="send-money-form-component">
                <Modal show={value.modalShowStatus}  onHide={handleClose} size="lg" centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Form to {value.modalOperation}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="d-flex flex-row mb-3 justify-content-center align-items-center flex-wrap">
                    <div className="p-2">
                        <form onSubmit={(e)=>handleSubmit(e)}>
                            <div className="mb-3">
                                <label htmlFor="accountnumber" className="form-label">
                                Your Account Number
                                </label>
                                <input
                                type="text"
                                className="form-control"
                                id="accountnumber"
                                name="accountNumber"
                                  value={depositMoneyInfo != null && depositMoneyInfo?.accountNumber}
                                  onChange={(e) => handleChange(e)}
                                disabled
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="userid" className="form-label">
                                Your User ID
                                </label>
                                <input
                                type="text"
                                className="form-control"
                                id="userid"
                                name="userId"
                                  value={depositMoneyInfo != null && depositMoneyInfo?.userId}
                                  onChange={(e) => handleChange(e)}
                                disabled
                                />
                            </div>
                    
                            <div className="mb-3">
                                <label htmlFor="amount" className="form-label">
                                Enter Amount <span style={{color: "red"}}> *</span>
                                </label>
                                <input
                                type="text"
                                className="form-control"
                                id="amount"
                                name="transactionAmount"
                                value={depositMoneyInfo != null && depositMoneyInfo?.transactionAmount}
                                onChange={(e)=>handleChange(e)}
                                onKeyUp={(e) => handleAmountValidation(e)}
                                />
                            </div>
                            <div className="d-flex justify-content-evenly">
                                <button type="submit" className="btn btn-primary" disabled={!isDetailsValid}>Deposit</button>
                            </div>
                        </form>
                    </div>
                    <div className="d-flex flex-row mb-3">
                        { errorAlertState && <AlertMessage show={errorAlertState.show} heading = {errorAlertState.heading} message={errorAlertState.message} />}
                    </div>
                    <div className="d-flex flex-row mb-3 justify-content-center align-items-center">
                        { successAlertState && <SuccessMessage show={successAlertState.show} heading = {successAlertState.heading} message={successAlertState.message} />}
                    </div>
                </div>
                    </Modal.Body>
                </Modal>
            </div>
        </React.Fragment>
     );
}

export default DepositMoneyModal;