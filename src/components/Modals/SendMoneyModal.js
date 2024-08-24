import React, { useContext, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import AccountContext from "../../context/AccountContext";
import UserContext from "../../context/UserContext";
import { transactionService } from "../../services/TransactionService";
import AlertMessage from "../AlertMessage";
import SuccessMessage from "./SuccessMessage";
import UserIdleChecker from "../../util/UserIdlechecker";

function SendMoneyModal({value}) {

    const { accountInformation } = useContext(AccountContext);
    const { userInfo } = useContext(UserContext);
    const initialState = {
        accountNumber: accountInformation?.accountNumber,
        userId: userInfo?.userInfo.userId,
        transactionType: "SEND_MONEY",
        beneficiaryAccountNumber: '',
        beneficiaryUserId: '',
        transactionAmount: ''

    }
    const [sendMoneyInfo, setSendMoneyInfo] = useState(initialState)

    const handleChange = (event) => {
        event.preventDefault();
        setSendMoneyInfo(prevState => ({
            ...prevState,
            [event.target.name] : event.target.value
        }));
    }

    const[isDetailsValid, setIsDetailsValid] = useState(false);
    const[errorState, setErrorState] = useState({show: false, heading: "", message: ""});
    const setErrorWarning = (warningMessage) => {
      setErrorState({show: true, heading: "Error", message: warningMessage});
      setTimeout(() => {
        setErrorState({show: false, heading: "", message: ""});
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
            setSendMoneyInfo(prevState => ({
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
        if(sendMoneyInfo.transactionAmount === ''){
            setErrorWarning("Enter Amount");
        }else if(sendMoneyInfo.beneficiaryAccountNumber === '' || sendMoneyInfo.beneficiaryUserId === ''){
            setErrorWarning("Beneficiary User ID And Beneficiary AccountNumber is Mandatory.");
        }else if(sendMoneyInfo.accountNumber === sendMoneyInfo.beneficiaryAccountNumber){
            setErrorWarning("Your Account Number And Beneficiary Account Number is Same, Please Provide Correct Beneficiary Account Number");
        } 
        else if(sendMoneyInfo.userId === sendMoneyInfo.beneficiaryUserId){
            setErrorWarning("Your User ID And Beneficiary User Id is Same, Please Provide Correct Beneficiary User ID");
        }
        else{
            try {
                const response = await transactionService(sendMoneyInfo);
                if(response && response.data.transactionId !== null){
                    setSuccessMessage("Money Sended Successfully, Transaction Id: " +  response.data.transactionId);
                } else if(response && response.data.transactionId === null) {
                    setErrorWarning("Your Send Money Transaction Failed, " + response.data.errorMessage);
                    setTimeout(() => {
                        handleClose();
                    }, 4000);
                }
            } catch (error) {
                
            }
        }
    }

    const handleReset = (event) => {
        event.preventDefault();
        setSendMoneyInfo(prevState => ({
            ...prevState,
            beneficiaryAccountNumber: '',
            beneficiaryUserId: '',
            transactionAmount: ''
        }));
    }

    const handleClose = () => {
        value.setHide(false);
        setSendMoneyInfo(initialState);
    }


    return ( 
        <React.Fragment>
            <div className="send-money-form-component">
                <Modal show={value.modalShowStatus}  onHide={handleClose} size="lg" centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Form to {value.modalOperation}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{height: "70vh", overflowY: "auto"}}>
                    <div className="d-flex flex-column mb-3 justify-content-center align-items-center flex-wrap">
                        <div className="p-2">
                            <h5 style={{color: "red"}}>Warning</h5>
                        </div>
                        <div className="p-1">
                            <p style={{fontSize: "13.2px"}}>Minimum Balance of 1000 Rupees Should Maintain in Your Account.</p>
                        </div>
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
                                  value={sendMoneyInfo != null && sendMoneyInfo?.accountNumber}
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
                                  value={sendMoneyInfo != null && sendMoneyInfo?.userId}
                                  onChange={(e) => handleChange(e)}
                                disabled
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="beneficiary_account_number" className="form-label">
                                Enter Account Number of Beneficiary <span style={{color: "red"}}> *</span>
                                </label>
                                <input
                                type="text"
                                className="form-control"
                                id="beneficiary_account_number"
                                name="beneficiaryAccountNumber"
                                  value={sendMoneyInfo.beneficiaryAccountNumber}
                                  onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="beneficiary_user_id" className="form-label">
                                Enter User ID of Beneficiary <span style={{color: "red"}}> *</span>
                                </label>
                                <input
                                type="text"
                                className="form-control"
                                id="beneficiary_user_id"
                                name="beneficiaryUserId"
                                  value={sendMoneyInfo?.beneficiaryUserId}
                                  onChange={(e) => handleChange(e)}
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
                                value={sendMoneyInfo != null && sendMoneyInfo?.transactionAmount}
                                onChange={(e)=>handleChange(e)}
                                onKeyUp={(e) => handleAmountValidation(e)}
                                />
                            </div>
                            <div className="d-flex justify-content-evenly">
                                <button type="submit" className="btn btn-primary" disabled={!isDetailsValid}>Transfer</button>
                                <button type="reset" onClick={(e) => handleReset(e)} className="btn btn-primary">Reset</button>
                            </div>
                        </form>
                    </div>
                    <div className="d-flex flex-row mb-3 justify-content-center align-items-center">
                        { errorState && <AlertMessage show={errorState.show} heading = {errorState.heading} message={errorState.message} />}
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

export default SendMoneyModal;