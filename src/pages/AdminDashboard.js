import React, {useState, useEffect} from "react";
import { fetchAllUsersApplicatiopns, updatePendindApplicationStatus } from "../services/AdminService";
import UserIdleChecker from "../util/UserIdlechecker";

function AdminDashboard() {
    
    const[usersApplications, setUsersApplications] = useState([]);

    useEffect(()=>{
        const fetchUnverifiedApplications = async() => {
           const response =  await fetchAllUsersApplicatiopns();
           setUsersApplications(response.data);
        }
        try {
            fetchUnverifiedApplications();
        } catch (error) {
            console.log(error);
        }
    },[]);

    const handleApplicationAction = (event, accountInformation) => {
        
            setUsersApplications(usersApplications
                .filter(userApplication => userApplication?.accountNumber !== accountInformation?.accountNumber));
            
            const updateAccountInformation = {
                accountNumber: accountInformation.accountNumber,
                userId: accountInformation.userId,
                adminActionOnApplication: ''
            }
            
            if(event.target.name === "accept"){
                updateAccountInformation.adminActionOnApplication = "accepted";
            } else if(event.target.name === "reject"){
                updateAccountInformation.adminActionOnApplication = "rejected";
            }
            updatePendindApplicationStatus(updateAccountInformation);
    }

    return (  
        <React.Fragment>
            <div className="admindashboard_component">
            <div className="idle_checker_div">
                    <UserIdleChecker />
                </div>
                <div className="details_table mt-5 px-5">
                    <table className="table table-striped table-bordered table-responsive">
                        <thead className="text-center">
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Account Number</th>
                            <th scope="col">User ID</th>
                            <th scope="col">Account Type</th>
                            <th scope="col">Account Balance</th>
                            <th scope="col">Account Status</th>
                            <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider text-center">
                            {usersApplications.map((userApplication, index) => {
                                return(
                                <tr key={index}>
                                <th scope="row">{index+1}</th>
                                <td>{userApplication?.accountNumber}</td>
                                <td>{userApplication?.userId}</td>
                                <td>{userApplication?.accountType}</td>
                                <td>{userApplication?.accountBalance}</td>
                                <td>{userApplication?.accountStatus}</td>
                                <td>
                                <div className="d-flex justify-content-evenly">
                                    <button type="button" className="btn btn-success" name="accept" onClick={(e) => handleApplicationAction(e, { accountNumber: userApplication?.accountNumber, userId: userApplication?.userId })}>Accept</button>
                                    <button type="button"  className="btn btn-danger" name="reject" onClick={(e) => handleApplicationAction(e,{ accountNumber: userApplication?.accountNumber, userId: userApplication?.userId })}>Reject</button>
                                </div>
                                </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex row-flex justify-content-center align-item-center">
                    {usersApplications.length === 0 && <h4 style={{color: 'red'}}>There is No Pending Application.</h4>}
                </div>
            </div>
        </React.Fragment>
    );
}

export default AdminDashboard;