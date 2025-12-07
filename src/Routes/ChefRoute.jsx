import React from 'react';
import Forbidden from '../Components/Forbidden/Forbidden';
import UseAuth from '../Hooks/UseAuth';
import useRole from '../Hooks/useRole';

const ChefRoute = ({ children }) => {
  const { loading } = UseAuth();
  const { role, roleLoading } = useRole();

  // Show loading while fetching user or role
  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  // Block access if user is not a chef
  if (role !== "chef") {
    return <Forbidden />;
  }

  // Allow access if role is chef
  return children;
};

export default ChefRoute;
