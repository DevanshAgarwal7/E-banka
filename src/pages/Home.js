import React, { useState, useContext, useEffect } from "react";
import '../styling/Home.css';
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import AlertMessage from "../components/AlertMessage";
import { loginService } from "../services/UserService";
import { fetchAccountDetailsService } from "../services/AccountService";
import { removeJwtTokenService, setJwtTokenService } from "../services/JwtTokenService";
import AccountContext from "../context/AccountContext";


function Home() {

  useEffect(() => {
    removeJwtTokenService();
  })

    const[userInput, setUserInput] = useState({
        userEmail: '',
        password: ''
    });

    const[errorState, setErrorState] = useState({show: false, heading: "", message: ""});

    const setErrorWarning = (warningMessage) => {
      setErrorState({show: true, heading: "Warning", message: warningMessage});
      setTimeout(() => {
        setErrorState({show: false, heading: "", message: ""});
      }, 3000);
    }

    const navigate = useNavigate();

    const { setUserInfo } = useContext(UserContext);
    const setUserContent  = (user) => {
      setUserInfo({userInfo: {
        userId: user.userId,
        userEmail: user.userEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        userRole: user.userRole,
        userApplicationStatus: user.userApplicationStatus
     }});
    }

    const  { setAccountInformation }  = useContext(AccountContext);
    const setAccountContext = (accountInformation) => {
      setAccountInformation(accountInformation);
    }

    const[isEnteredEmailValid, setEnteredEmailValidStatus] = useState(false);
    const[isEnteredPasswordValid, setEnteredPasswordValidStatus] = useState(false);

    const handleValidate = (event) =>{
      const name = event.target.name;
      if(name === "userEmail"){
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
          setEnteredEmailValidStatus(regex.test(event.target.value));
      } else if(name === "password"){
        event.target.value.length >=3 ? setEnteredPasswordValidStatus(true) : setEnteredPasswordValidStatus(false);
      }
    }

    const handleSubmit = async (event) =>{
        event.preventDefault();
        setUserInput({userEmail: '', password: ''});
        try {
            const response = await loginService(userInput);
            if(response.status === 200){
              setJwtTokenService(response.data.jwtInformation.token);
              if(response.data.user.userRole === "YES"){
                  setUserContent(response.data.user);
                  navigate("/admin-dashboard");
              } else if(response.data.user.userRole === "NO"){
                if(response.data.user.userApplicationStatus === "PENDING"){
                  setUserContent(response.data.user);
                  navigate("/createaccount");
                } else if(response.data.user.userApplicationStatus === "REJECTED") {
                  setErrorWarning("Your Previous Application is Rejected. You can Submit New Application.");
                  setTimeout(() => {
                    setUserContent(response.data.user);
                    navigate("/createaccount");
                  }, 4000);
                } else if(response.data.user.userApplicationStatus === "SUBMITTED"){
                    const account = await fetchAccountDetailsService(response.data.user.userId);
                    if(account.data.accountStatus === "UNDER_VERIFICATION"){
                      removeJwtTokenService();
                      setErrorWarning("Your Application is Under Verification. Please Wait until Verified.")
                    } else if(account.data.accountStatus === "CREATED"){
                      setUserContent(response.data.user);
                      setAccountContext({
                        accountNumber: account.data.accountNumber,
                        accountType: account.data.accountType,
                        accountBalance: account.data.accountBalance
                      });
                      navigate("/account");
                    }
                }
              }
            }
        } catch (error) {
          setErrorWarning("Please Provide Correct Credentials or You are not registered with us.");
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
        setUserInput({userEmail: '', password: ''});
        setEnteredEmailValidStatus(false);
        setEnteredPasswordValidStatus(false);
    }

  return (
    <React.Fragment>
      <div className="home_component">
      < div className="d-flex flex-row mb-3 justify-content-center align-items-center flex-wrap">
            <div className="card mb-3 mx-3 p-2 flex-shrink-0">
                <div className="row g-0">
                    <div className="col-md-4">
                    <img className="logo_image rounded-start" src="https://th.bing.com/th/id/R.76bd69a842e5be319853bf96c6a9e7ea?rik=o3VIjP3uJrpCeg&riu=http%3a%2f%2fwww.wholepost.com%2fwp-content%2fuploads%2f2019%2f07%2fOnline-Banking.png&ehk=W8icm5CFkxdB2O06Li4LFX1xeqV0x7UHLi6wF0CwCSU%3d&risl=&pid=ImgRaw&r=0"
                 alt="Logo" />
                    </div>
                </div>
            </div>
            <div className="p-2">
            <form onSubmit={(e)=>handleSubmit(e)}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email Address <span style={{color: "red"}}> *</span>
            </label>
            <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
            </div>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              name="userEmail"
              value={userInput.userEmail}
              onChange={(e)=>handleChange(e)}
              onKeyUp={(e) => handleValidate(e)}
              aria-describedby="emailHelp"
            />
            <span id="emailHelp" className="form-text">
            {!isEnteredEmailValid && <p style={{color: "red"}}>Enter Valid Email Address</p>}
            </span>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password <span style={{color: "red"}}> *</span>
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              value={userInput.password}
              onChange={(e)=>handleChange(e)}
              onKeyUp={(e) => handleValidate(e)}
            />
            <span className="form-text">
              {!isEnteredPasswordValid && <p style={{color: "red"}}>Minimum Length of Password Should Be 3.</p>}
            </span>
          </div>
          <div className="d-flex justify-content-end">
            <Link to="/signup"><p>New User? Open an Account</p></Link>
          </div>
          <div className="d-flex justify-content-evenly">
          <button type="submit" className="btn btn-primary" disabled={!isEnteredEmailValid || !isEnteredPasswordValid}>Login</button>
          <button onClick={(e)=>handleReset(e)} className="btn btn-primary">Reset</button>
          </div>
        </form>
            </div>
        </div>
      </div>
      <div className="d-flex flex-row mb-3 justify-content-center align-items-center">
        { errorState && <AlertMessage show={errorState.show} heading = {errorState.heading} message={errorState.message} />}
      </div>
    </React.Fragment>
  );
}

export default Home;
