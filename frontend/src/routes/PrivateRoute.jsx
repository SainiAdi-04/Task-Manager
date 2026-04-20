import React, { useContext } from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/userContext";

const PrivateRoute = ({allowedRoles}) => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const isAllowedRole = !allowedRoles || allowedRoles.includes(user.role);

    if (!isAllowedRole) {
        return <Navigate to="/" replace />;
    }

    return <Outlet/>
}
export default PrivateRoute
