import React, { useContext, useEffect } from "react";
import AccountInformation from "../components/AccountInformation";
import AccountOperation from "../components/AccountOperation";
import AccountContext from "../context/AccountContext";
import UserIdleChecker from "../util/UserIdlechecker";



function AccountSummary() {
    const operationsArray = ['Send Money', 'Deposit Money', 'Withdraw Money', 'View Statement'];
    
    const {accountInformation} = useContext(AccountContext);

    return ( 
        <React.Fragment>
            <div className="summary_component">
            <div className="idle_checker_div">
                    <UserIdleChecker />
                </div>
                <div className="account_information_div mt-5">
                    <div className="account_balance_info_div d-flex justify-content-center">
                        <AccountInformation account={accountInformation} />
                    </div>
                    <div className="account_operations_div">
                        < div className="d-flex flex-row mb-3 justify-content-center align-items-center flex-wrap">
                            {operationsArray.map((operation, index) => (
                                <div key={index} className="p-4">
                                    <AccountOperation operation={operation} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
     );
}

export default AccountSummary;