import React, { useState } from "react";
import { checkAccountbalanceService } from "../services/AccountService";

function AccountInformation({account}) {

    const [accountBalance, setAccountBalance] = useState(null);
    const handleCheckBalance = async () => {
       const response =  await checkAccountbalanceService({accountNumber: account?.accountNumber});
       setAccountBalance(response.data.accountBalance);
       setTimeout(() => {
        setAccountBalance(null);
       }, 3000);
    }
    return (  
        <React.Fragment>
            <div className="card col-3">
                <div className="card-body text-center">
                    <div className="d-flex flex-row justify-content-center mb-3">
                        <div>
                            <h5 className="card-title mb-3 text-start">My {account?.accountType} Account</h5>
                            <h6 className="card-subtitle mt-4 mb-3 text-body-secondary">Account: {account?.accountNumber}</h6>
                            {accountBalance != null ? <h4>Balance: {accountBalance}</h4>: <button type="button" className="btn btn-outline-info" onClick={handleCheckBalance}>Check Balance</button>}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default AccountInformation;