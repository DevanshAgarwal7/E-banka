import React, {useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import { createAccountService } from "../services/AccountService";
import UserIdleChecker from "../util/UserIdlechecker";
import { Navigate, useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import SuccessMessage from "../components/Modals/SuccessMessage";
import { logoutService } from "../services/LogoutService";

function CreateAccount() {

    const[userInput, setUserInput] = useState({
        userId: '',
        accountType: '',
        accountBalance: ''
    });

    const navigate = useNavigate();

    const{userInfo, setUserInfo} = useContext(UserContext);

    useEffect(()=>{
        setUserInput(prevState => ({
            ...prevState,
            userId: userInfo?.userInfo?.userId
          }));
    }, [userInfo]);

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
          } else if(parseFloat(event.target.value) < 1000){
            setIsDetailsValid(false);
            setErrorWarning('Minimum Starting Balance Should Not Be Less Than 1000.');
          } else {
            setUserInput(prevState => ({
                ...prevState,
                [event.target.name]: parseFloat(event.target.value)
            }));
            setIsDetailsValid(true);
          }
    }

    const[successState, setSuccessState] = useState({show: false, heading: "", message: ""});

    const setSuccessMessage = async (successMessage) => {
      setSuccessState({show: true, heading: "Success", message: successMessage});
      setTimeout(() => {
        setSuccessState({show: false, heading: "", message: ""});
        logoutService();
        setUserInfo(null);
        navigate("/");
      }, 3000);
      
    }

    const handleSubmit = async (event) =>{
        event.preventDefault();
        if(userInput?.accountType === ''){
            setErrorWarning('Please Select  Gender.');
        } else{
            setIsDetailsValid(false);
            try {
                const response =  await createAccountService( userInput);
                setSuccessMessage("Your Application is Submitted Successfully.");
            } catch (error) {
                if(error.response.status === 400){
                    console.log(error.response)
                }
            }
        }
    }

    const handleChange = (event) => {
        event.preventDefault();
        setUserInput(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
          }));

    }

    const handleReset = (event) => {
        event.preventDefault();
        setUserInput({
            accountType: '',
            accountBalance: ''
        });
        setIsDetailsValid(false);
    }

    return(
        <React.Fragment>
            <div className="createaccount_component">
                <div className="idle_checker_div">
                    <UserIdleChecker />
                </div>
                <div className="d-flex flex-column mb-3 justify-content-center align-items-center flex-wrap">
                        <div className="p-2">
                            <h5 style={{color: "red"}}>Warning</h5>
                        </div>
                        <div className="p-1">
                            <p style={{fontSize: "13.2px"}}>Minimum Balance of 1000 Rupees Should Required to Open New Account.</p>
                        </div>
                    <div className="p-2">
                        <form onSubmit={(e)=>handleSubmit(e)}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">
                        Email Address
                        </label>
                        <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        name="userEmail"
                          value={userInfo != null && userInfo?.userInfo?.userEmail}
                          onChange={(e) => handleChange(e)}
                        disabled
                        aria-describedby="emailHelp"
                        />
                        <div id="emailHelp" className="form-text">
                        We'll never share your email with anyone else.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="firstname" className="form-label">
                        First Name
                        </label>
                        <input
                        type="text"
                        className="form-control"
                        id="firstname"
                        name="firstName"
                          value={userInfo != null && userInfo?.userInfo?.firstName}
                          onChange={(e) => handleChange(e)}
                        disabled
                        aria-describedby="emailHelp"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastname" className="form-label">
                        Last Name
                        </label>
                        <input
                        type="text"
                        className="form-control"
                        id="lastname"
                        name="lastName"
                          value={userInfo != null && userInfo?.userInfo?.lastName}
                          onChange={(e) => handleChange(e)}
                        disabled
                        aria-describedby="emailHelp"
                        />
                    </div>
                    <div>
                    <label className="form-check-label">Account Type <span style={{color: "red"}}> *</span></label>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="accountType" value="SAVING" onClick={(e) => handleChange(e)} id="flexRadioDefault1" />
                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                Saving Account
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="accountType" value="CURRENT" onClick={(e) => handleChange(e)} id="flexRadioDefault2" />
                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                Current Account
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="accountType" value="INVESTMENT" onClick={(e) => handleChange(e)} id="flexRadioDefault3" />
                            <label className="form-check-label" htmlFor="flexRadioDefault3">
                                Investment Account
                            </label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="balance" className="form-label">
                        Starting Balance <span style={{color: "red"}}> *</span>
                        </label>
                        <input
                        type="text"
                        className="form-control"
                        id="balance"
                        name="accountBalance"
                        value={userInput.accountBalance}
                        onChange={(e)=>handleChange(e)}
                        onKeyUp={(e) => handleAmountValidation(e)}
                        />
                    </div>
                    <div className="d-flex justify-content-evenly">
                    <button type="submit" className="btn btn-primary" disabled={!isDetailsValid}>Submit</button>
                    <button type="reset" onClick={(e) => handleReset(e)} className="btn btn-primary">Reset</button>
                    </div>
                        </form>
                    </div>
                    <div className="d-flex flex-row mb-3 justify-content-center align-items-center">
                        { errorState && <AlertMessage show={errorState.show} heading = {errorState.heading} message={errorState.message} />}
                    </div>
                    <div className="d-flex flex-row mb-3 justify-content-center align-items-center">
                        { successState && <SuccessMessage show={successState.show} heading = {successState.heading} message={successState.message} />}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default CreateAccount;