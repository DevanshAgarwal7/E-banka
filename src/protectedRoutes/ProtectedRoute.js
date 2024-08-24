import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

    const {userInfo} = useContext(UserContext);
    
    return (
        userInfo != null ? <Outlet /> :  <Navigate to="/" />
    )
}

export default ProtectedRoute;