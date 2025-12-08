import React from 'react';
import { Outlet } from 'react-router';
import { Toaster } from "react-hot-toast";

const AuthLayout = () => {
    return (
        <div>
             <Toaster position="top-right" reverseOrder={false} />
            <div>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default AuthLayout;