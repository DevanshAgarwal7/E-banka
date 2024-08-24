import React, { useState, useContext, useEffect } from "react";
import '../styling/Signup.css'
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import AlertMessage from "../components/AlertMessage";
import { signUpService } from "../services/UserService";
import { removeJwtTokenService, setJwtTokenService } from "../services/JwtTokenService";

function Signup() {    

    useEffect(() => {
        removeJwtTokenService();
    })

    const initialState = {
        userEmail: '',
        firstName: '',
        lastName: '',
        password: ''
    };

    const[userInput, setUserInput] = useState(initialState);

    const {setUserInfo} = useContext(UserContext);
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
    
    const[errorState, setErrorState] = useState({show: false, heading: "", message: ""});
    const setErrorWarning = (warningMessage) => {
      setErrorState({show: true, heading: "Warning", message: warningMessage});
      setTimeout(() => {
        setErrorState({show: false, heading: "", message: ""});
      }, 3000);
    }

    const navigate = useNavigate();

    const[isEnteredEmailValid, setEnteredEmailValidStatus] = useState(false);
    const[isEnteredPasswordValid, setEnteredPasswordValidStatus] = useState(false);
    const[isEnteredFirstNameValid, setEnteredFirstNameValidStatus] = useState(false);
    const[isEnteredLastNameValid, setEnteredLastNameValidStatus] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();
        setUserInput(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
          }));

    }

    const handleValidate = (event) =>{
      const name = event.target.name;
      if(name === "userEmail"){
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
        setEnteredEmailValidStatus(regex.test(event.target.value));
      } else if(name === "firstName"){
        event.target.value.length >=3 ? setEnteredFirstNameValidStatus(true) : setEnteredFirstNameValidStatus(false);
      }else if(name === "lastName"){
        event.target.value.length >=3 ? setEnteredLastNameValidStatus(true) : setEnteredLastNameValidStatus(false);
      }else if(name === "password"){
        event.target.value.length >=3 ? setEnteredPasswordValidStatus(true) : setEnteredPasswordValidStatus(false);
      }
    }

    const handleSubmit = async (event) =>{
        event.preventDefault();
        try {
            const response =  await signUpService(userInput);
            setUserContent(response.data.user);
            setJwtTokenService(response.data.jwtInformation.token);
            navigate('/createaccount');
        } catch (error) {
            setErrorWarning("You are Already Registered With Us.");
        }
    }


     const handleLoginRoute = () => {
        navigate("/");
    }

    const handleReset = (event) => {
        event.preventDefault();
        setUserInput(initialState);
        setEnteredEmailValidStatus(false);
        setEnteredFirstNameValidStatus(false);
        setEnteredLastNameValidStatus(false);
        setEnteredPasswordValidStatus(false);
    }

    return(
        <React.Fragment>
            <div className="signup_component">
            < div className="d-flex flex-row mb-3 justify-content-center align-items-center flex-wrap">
            <div className="card mb-3 p-2 mx-3 flex-shrink-0">
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
                <label htmlFor="firstname" className="form-label">
                First Name <span style={{color: "red"}}> *</span>
                </label>
                <input
                type="text"
                className="form-control"
                id="firstname"
                name="firstName"
                value={userInput.firstName}
                onChange={(e)=>handleChange(e)}
                onKeyUp={(e) => handleValidate(e)}
                />
                <span className="form-text">
                    {!isEnteredFirstNameValid && <p style={{color: "red"}}>Minimum Length of First Name Should Be 3.</p>}
                </span>
            </div>
            <div className="mb-3">
                <label htmlFor="lastname" className="form-label">
                Last Name <span style={{color: "red"}}> *</span>
                </label>
                <input
                type="text"
                className="form-control"
                id="lastname"
                name="lastName"
                value={userInput.lastName}
                onChange={(e)=>handleChange(e)}
                onKeyUp={(e) => handleValidate(e)}
                />
                <span className="form-text">
                    {!isEnteredLastNameValid && <p style={{color: "red"}}>Minimum Length of Last Name Should Be 3.</p>}
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
                <button type="button" onClick={handleLoginRoute} className="btn btn-link">Aleary Registered? Login</button>
            </div>
            <div className="d-flex justify-content-start">
                <button type="submit" className="btn btn-primary submit_button" disabled={!isEnteredEmailValid || !isEnteredPasswordValid
                    || !isEnteredFirstNameValid || !isEnteredLastNameValid
                }>SignUp</button>
                <button type="reset" onClick={(e) => handleReset(e)} className="btn btn-primary">Reset</button>
            </div>
            </form>
            </div>
        </div>
            </div>
            <div className="d-flex flex-row mb-3 justify-content-center align-items-center">
                { errorState && <AlertMessage show={errorState.show} heading = {errorState.heading} message={errorState.message} />}
            </div>
        </React.Fragment>
    )
}

export default Signup;