import React, { useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccountContext from '../context/AccountContext';
import UserContext from '../context/UserContext';
import { logoutService } from './LogoutService';

const TokenValidatorChecker = ({children}) => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const {setAccountInformation} = useContext(AccountContext);
  const navigate = useNavigate();

  useEffect(() => {
    checkToken(); // Initial check
    window.addEventListener('storage', onStorageChange);

    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.post('http://localhost:8081/api/auth/validatetoken', { generatedToken: token,  userCredentials: {userEmail: userInfo?.userInfo.userEmail, password: null}});
      return response.data.isValid;
    } catch (error) {
      return false;
    }
  };

  const checkToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const isValid = await validateToken(token);
        if (!isValid) {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    } else {
      handleLogout();
    }
  };

  const handleLogout = () => {
    logoutService();
    setUserInfo(null);
    setAccountInformation(null);
    
    navigate('/');
  };

  const onStorageChange = (event) => {
    if (event.key === 'token') {
      checkToken();
    }
  };


  return children; 
};

export default TokenValidatorChecker;
