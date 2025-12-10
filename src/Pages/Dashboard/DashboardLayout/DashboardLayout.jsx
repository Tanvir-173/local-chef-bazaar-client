import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { FaBars, FaTimes } from "react-icons/fa";

const DashboardLayout = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const [menuOpen, setMenuOpen] = useState(false); // dropdown menu toggle for mobile
  const location = useLocation(); // get current path

  // Fetch user info
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["db-user-info", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <p className="text-center mt-10">Loading Dashboard...</p>;

  const role = userInfo?.role || "user";

  const links = {
    user: [
      { name: "My Profile", path: "profile" },
      { name: "My Orders", path: "orders" },
      { name: "My Review", path: "reviews" },
      { name: "Favorite Meals", path: "favorites" },
      { name: "Home", path: "/" }
    ],
    chef: [
      { name: "My Profile", path: "profile" },
      { name: "Create Meal", path: "create-meal" },
      { name: "My Meals", path: "my-meals" },
      { name: "Order Requests", path: "order-requests" },
      { name: "Home", path: "/" }
    ],
    admin: [
      { name: "My Profile", path: "profile" },
      { name: "Manage Users", path: "manage-users" },
      { name: "Manage Requests", path: "manage-requests" },
      { name: "Platform Statistics", path: "statistics" },
      { name: "Home", path: "/" }
    ],
  };

  // Determine if we are on the default dashboard route
  const isDashboardHome = location.pathname === "/dashboard";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar for mobile */}
      <header className="flex justify-between items-center bg-gray-900 text-white p-4 md:hidden">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="md:hidden bg-gray-800 text-white p-4 space-y-2">
          {links[role].map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "block text-yellow-400 font-semibold"
                  : "block hover:text-yellow-400"
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 md:bg-gray-900 md:text-white md:p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <ul className="space-y-4">
            {links[role].map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-400 font-semibold"
                      : "hover:text-yellow-400"
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <Toaster position="top-right" reverseOrder={false} />
          
          {/* Show welcome message if on default dashboard route */}
          {isDashboardHome ? (
            <div className="flex items-center justify-center h-full">
              <h2 className="text-3xl font-bold text-gray-700 text-center">
                Welcome to Dashboard! <br />
                Please select an activity.
              </h2>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
