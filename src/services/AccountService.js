import axios from "axios";
import RequestHeaderCreationService from "./RequestHeaderCreationService";

export const fetchAccountDetailsService = async (userId) => {
    try {
        return await axios.post("http://localhost:8081/api/account/fetch", {userId: userId}, RequestHeaderCreationService());
    } catch (error) {
        throw error;
    }
}

export const createAccountService = async (accountInformation) =>{
    try {
        return await axios.post("http://localhost:8081/api/account/create", accountInformation, RequestHeaderCreationService());
    } catch (error) {
        throw error;
    }
}

export const checkAccountbalanceService = async (accountInformation) => {
    try {
        return await axios.post("http://localhost:8081/api/account/checkbalance", accountInformation, RequestHeaderCreationService());
    } catch (error) {
        throw error
    }
}