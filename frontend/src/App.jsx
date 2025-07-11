import React, {useContext} from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route, Outlet, Navigate
} from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import ManageTasks from "./pages/Admin/ManageTasks.jsx";
import CreateTask from "./pages/Admin/CreateTask.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";

import UserDashboard from "./pages/User/UserDashboard.jsx";
import MyTasks from "./pages/User/MyTasks.jsx";
import ViewTaskDetails from "./pages/User/ViewTaskDetails.jsx";

import PrivateRoute from "./routes/PrivateRoute.jsx";
import UserProvider, {UserContext} from "./context/userContext.jsx";
import { Toaster } from 'react-hot-toast';


const App = () => {


    return (
        <UserProvider>
        <div>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signUp" element={<SignUp/>}/>


                    <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
                        <Route path="/admin/dashboard" element={<Dashboard/>}/>
                        <Route path="/admin/tasks" element={<ManageTasks />}/>
                        <Route path="/admin/create-tasks" element={<CreateTask/>}/>
                        <Route path="/admin/users" element={<ManageUsers />}/>
                    </Route>


                    <Route element={<PrivateRoute allowedRoles={["user"]}/>}>
                        <Route path="/user/dashboard" element={<UserDashboard/>}/>
                        <Route path="/user/my-tasks" element={<MyTasks/>}/>
                        <Route path="/user/task-details/:id" element={<ViewTaskDetails/>}/>

                    </Route>
                    <Route path="/" element={<Root/>}/>
                </Routes>
            </Router>
        </div>

        <Toaster
        toastOptions={{
            className:'',
            style:{
                fontSize:"13px"
            }
        }}
        />
        </UserProvider>
    )
}
export default App

const Root=()=>{
    const {user, loading}=useContext(UserContext);
    if(loading) return <Outlet/>

    if(!user){
        return <Navigate to="/login"/>
    }

    return user.role==="admin"?<Navigate to="/admin/dashboard"/>:<Navigate to="/user/dashboard"/>
}
