import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logoutService } from "../services/LogoutService";
import AlertMessage from "../components/AlertMessage";
import UserContext from "../context/UserContext";
import AccountContext from "../context/AccountContext";

function UserIdleChecker() {
    const navigate = useNavigate();
    
    const [loggedInStatus, setLoginStaus] = useState(true);
    const [errorState, setErrorState] = useState({show: false, message: ""});

    const {setUserInfo} = useContext(UserContext);
    const {setAccountInformation} = useContext(AccountContext);

    const executeErrorState = (warningMessage) => {
        setErrorState({show: true, message: warningMessage});
        setTimeout(() => {
            setErrorState({show: false, message: ""});
            logoutService();
            setUserInfo(null);
            setAccountInformation(null);
            navigate("/");
        }, 3000);
    }
    
    //function to check login status
    function checkLogginStatus(){
        if(localStorage.getItem('currentStatus') < Date.now()){
            setLoginStaus(false);
            executeErrorState("You remain Idle for more than 2 minutes. Please Login Again.");
        }
    }

    //function to update expiration time
    function updateExpirationTime(){
        localStorage.setItem('currentStatus', Date.now() + 5000);
    }

    //useEffect to check 
    useEffect(() => {
        const interval = setInterval(() => {
            checkLogginStatus();
        }, 120000);

        return() => {
            clearInterval(interval);
        }
    }, []);

    //Update expire time on user activity
    useEffect(() => {
        //set initial expiration time
        updateExpirationTime();

        //set event at which the expire time updated
        window.addEventListener("click", updateExpirationTime);
        window.addEventListener("mousemove", updateExpirationTime);
        window.addEventListener("keypress", updateExpirationTime);
        window.addEventListener("scroll", updateExpirationTime);

        //clean up
        return () => {
        window.removeEventListener("click", updateExpirationTime);
        window.removeEventListener("mousemove", updateExpirationTime);
        window.removeEventListener("keypress", updateExpirationTime);
        window.removeEventListener("scroll", updateExpirationTime);
        }
    }, [])

    return (  
        <React.Fragment>
            { !loggedInStatus && <AlertMessage show={errorState.show} message={errorState.message} />}
        </React.Fragment>
    );
}

export default UserIdleChecker;