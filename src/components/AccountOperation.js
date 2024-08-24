import React, { useState } from "react";
import '../styling/AccountOperation.css';
import SendMoneyModal from "./Modals/SendMoneyModal";
import DepositMoneyModal from "./Modals/DepositMoneyModal";
import WithdrawMoneyModal from "./Modals/WithdrawMoneyModal";
import ViewStatementModal from "./Modals/ViewStatementModal";

function AccountOperation({operation}) {
    const operationType = operation;

    const selectLogo = () => {
        switch(operationType){
            case "Send Money":
                return 'https://clipground.com/images/money-transfer-logo-clipart-3.jpg';
                case 'Deposit Money':
                    return 'https://static.vecteezy.com/system/resources/previews/014/363/960/non_2x/money-deposit-icon-simple-style-vector.jpg';
                case 'Withdraw Money':
                    return 'https://cdn3.iconfinder.com/data/icons/business-632/50/33-512.png';
                case 'View Statement':
                    return 'https://thumbs.dreamstime.com/b/bank-statement-icon-financial-vector-illustration-255884845.jpg';
                default:
                    return '';
        }
    }

    const[operationFormModalStatus, setOperationFormModalStatus] = useState(false);

    const handleShowOperationForm = async (event) => {
        event.preventDefault();
        setOperationFormModalStatus(currentState => !currentState);
    }

    return ( 
        <React.Fragment>
        <div className="card col-12">
                <div className="card-body text-center">
                <div className="d-flex flex-column mb-3">
                    <div className="p-2">
                        <img src={selectLogo()} className="img-thumbnail image" alt="Operation Logo" />
                    </div>
                    <div className="p-2">
                        <button type="button" className="btn btn-outline-info" onClick={(e) => handleShowOperationForm(e)}>{operation}</button>
                        {
                            operation === "Send Money" && <SendMoneyModal value={{modalShowStatus: operationFormModalStatus, setHide: setOperationFormModalStatus, modalOperation: `${operation} `}} />
                        }
                        {
                            operation === "Deposit Money" && <DepositMoneyModal value={{modalShowStatus: operationFormModalStatus, setHide: setOperationFormModalStatus, modalOperation: `${operation} `}} />
                        }
                        {
                            operation === "Withdraw Money" && <WithdrawMoneyModal value={{modalShowStatus: operationFormModalStatus, setHide: setOperationFormModalStatus, modalOperation: `${operation} `}} />
                        }
                        {
                            operation === "View Statement" && <ViewStatementModal value={{modalShowStatus: operationFormModalStatus, setHide: setOperationFormModalStatus, modalOperation: `${operation} `}} />
                        }
                    </div>
                </div>
                </div>
            </div>
        </React.Fragment>
     );
}

export default AccountOperation;