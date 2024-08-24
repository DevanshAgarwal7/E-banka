import axios from "axios";
import RequestHeaderCreationService from "./RequestHeaderCreationService";

export const fetchAllUsersApplicatiopns = async() =>{
    try {
        return await axios.get("http://localhost:8081/api/admin/allusersapplications", RequestHeaderCreationService());
    } catch (error) {
        throw Error;
    }
}

export const updatePendindApplicationStatus = async(adminOperation) => {
    try {
        await axios.post("http://localhost:8081/api/admin/updateapplication", adminOperation, RequestHeaderCreationService());
    } catch (error) {
        throw Error
    }
}