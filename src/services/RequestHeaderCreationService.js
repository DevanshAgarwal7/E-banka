import { getJwtTokenService } from "./JwtTokenService";

const RequestHeaderCreationService = () => {
    const token = getJwtTokenService();
    if(!token) throw Error;
    else{
        return {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }, 
        'Access-Control-Allow-Credentials': true
        }
    }
}

const RequestHeaderForImageCreationService = () => {
    const token = getJwtTokenService();
    if(!token) throw Error;
    else{
        return {headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }, 
        'Access-Control-Allow-Credentials': true
        }
    }
}

export {RequestHeaderForImageCreationService};

export default RequestHeaderCreationService;