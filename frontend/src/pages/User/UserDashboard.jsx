import React from 'react'
import {useUserAuth} from "../../hooks/useUserAuth.jsx";

const UserDashboard = () => {
    useUserAuth();
    return (
        <div>UserDashboard</div>
    )
}
export default UserDashboard
