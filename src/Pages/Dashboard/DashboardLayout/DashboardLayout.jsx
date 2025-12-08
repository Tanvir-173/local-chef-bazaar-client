// import React from "react";
// import { Outlet, NavLink } from "react-router";
// import useAxiosSecure from "../../../Hooks/useAxiosSecure";
// import UseAuth from "../../../Hooks/UseAuth";
// import { useQuery } from "@tanstack/react-query";
// import { Toaster } from "react-hot-toast";

// const DashboardLayout = () => {
//   const { user } = UseAuth();
//   const axiosSecure = useAxiosSecure();

//   // Fetch user info from database
//   const { data: userInfo, isLoading } = useQuery({
//     queryKey: ["db-user-info", user?.email],
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/users/${user.email}`);
//       return res.data;
//     },
//     enabled: !!user?.email,
//   });

//   if (isLoading) {
//     return <p className="text-center mt-10">Loading Dashboard...</p>;
//   }

//   const role = userInfo?.role || "user";

//   const links = {
//     user: [
//       { name: "My Profile", path: "profile" },
//       { name: "My Orders", path: "orders" },
//       { name: "My Review", path: "reviews" },
//       { name: "Favorite Meals", path: "favorites" },
//     ],
//     chef: [
//       { name: "My Profile", path: "profile" },
//       { name: "Create Meal", path: "create-meal" },
//       { name: "My Meals", path: "my-meals" },
//       { name: "Order Requests", path: "order-requests" },
//     ],
//     admin: [
//       { name: "My Profile", path: "profile" },
//       { name: "Manage Users", path: "manage-users" },
//       { name: "Manage Requests", path: "manage-requests" },
//       { name: "Platform Statistics", path: "statistics" },
//     ],
//   };

//   return (
//     <div className="flex min-h-screen">
//       <aside className="w-64 bg-gray-900 text-white p-6">
//         <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
//         <ul className="space-y-4">
//           {links[role].map((link) => (
//             <li key={link.path}>
//               <NavLink
//                 to={link.path}
//                 className={({ isActive }) =>
//                   isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-400"
//                 }
//               >
//                 {link.name}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </aside>

//       <main className="flex-1 bg-gray-100 p-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default DashboardLayout;
import React from "react";
import { Outlet, NavLink } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const DashboardLayout = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch user info from database
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["db-user-info", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading Dashboard...</p>;
  }

  const role = userInfo?.role || "user";

  const links = {
    user: [
      { name: "My Profile", path: "profile" },
      { name: "My Orders", path: "orders" },
      { name: "My Review", path: "reviews" },
      { name: "Favorite Meals", path: "favorites" },
    ],
    chef: [
      { name: "My Profile", path: "profile" },
      { name: "Create Meal", path: "create-meal" },
      { name: "My Meals", path: "my-meals" },
      { name: "Order Requests", path: "order-requests" },
    ],
    admin: [
      { name: "My Profile", path: "profile" },
      { name: "Manage Users", path: "manage-users" },
      { name: "Manage Requests", path: "manage-requests" },
      { name: "Platform Statistics", path: "statistics" },
    ],
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          {links[role].map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-400"
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6 relative">
        {/* Toaster for all dashboard toasts */}
        <Toaster position="top-right" reverseOrder={false} />

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

