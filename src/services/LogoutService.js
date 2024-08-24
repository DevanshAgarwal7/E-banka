
export const logoutService = () => {
    if(localStorage.getItem("token")){
        localStorage.removeItem("token");
    }
    if(localStorage.getItem("currentStatus")){
        localStorage.removeItem("currentStatus");
    }
}