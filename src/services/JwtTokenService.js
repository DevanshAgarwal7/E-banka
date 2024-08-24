export const setJwtTokenService = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
}

export const getJwtTokenService = () => {
    if(localStorage.getItem("token")){
        return localStorage.getItem("token")
    }
    return null;
}

export const removeJwtTokenService = () => {
    if(getJwtTokenService()){
        localStorage.removeItem("token");
        localStorage.clear();
    }
}