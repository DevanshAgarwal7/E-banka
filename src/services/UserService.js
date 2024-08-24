import axios from "axios";
import RequestHeaderCreationService from "./RequestHeaderCreationService";

const loginService = async (authenticationCredentials) => {
    try {
        return await axios.post('http://localhost:8081/api/auth/login', {userEmail: authenticationCredentials.userEmail, password: authenticationCredentials.password});
    } catch (error) {
        throw error;
    }
}

const signUpService = async (userInformation) => {
    try {
        return await axios.post('http://localhost:8081/api/auth/save', {
            userEmail: userInformation.userEmail, firstName: userInformation.firstName,
            lastName: userInformation.lastName, password: userInformation.password,
            userRole: "USER", userApplicationStatus: "PENDING"
        });
    } catch (error) {
        throw error;
    }
}

const fetchUserDetailsService = async(userId) => {
    return await axios.post("http://localhost:8081/api/user/fetchdetails", {userId: userId}, RequestHeaderCreationService());
}

const updateUserDetailsService = async(userDetails) => {
    return await axios.post("http://localhost:8081/api/user/updatedetails", userDetails , RequestHeaderCreationService());
}

const updateProfilePicImageService = async(updatedProfilePicInfo) => {
    return await axios.post("http://localhost:8081/api/user/updateprofilepic", updatedProfilePicInfo, RequestHeaderCreationService());
}

export {loginService, signUpService, fetchUserDetailsService ,updateUserDetailsService, updateProfilePicImageService};