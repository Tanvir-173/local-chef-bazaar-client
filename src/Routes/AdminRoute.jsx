import React from 'react';
import Forbidden from '../Components/Forbidden/Forbidden';
import UseAuth from '../Hooks/UseAuth';
import useRole from '../Hooks/useRole';

const AdminRoute = ({children}) => {
    const {loading}=UseAuth()
    
    const {role,roleLoading}=useRole()
    if(loading || roleLoading){
         return <div>
            <span className="loading loading-ring loading-xl"></span>
        </div>
    }
    if(role !== "admin"){
         return <Forbidden></Forbidden>
    }
    
    return children
};

export default AdminRoute;