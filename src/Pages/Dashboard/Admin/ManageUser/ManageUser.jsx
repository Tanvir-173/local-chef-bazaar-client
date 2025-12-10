import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const auth = getAuth(); // Get Firebase auth instance

  // Function to get the current user's ID token
  const getToken = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return await currentUser.getIdToken(true);
    }
    return null;
  };

  // Function to fetch all users
  const fetchUsers = async () => {
    const token = await getToken();
    if (!token) {
      console.error("No token found, user may not be logged in");
      return;
    }

    try {
      const res = await axios.get("https://local-chef-bazaar.vercel.app/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      Swal.fire("Error", "Unauthorized or failed to fetch users", "error");
    }
  };

  // Call fetchUsers on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to mark a user as fraud
  const handleMakeFraud = async (id) => {
    const token = await getToken();
    if (!token) {
      Swal.fire("Error", "User not authenticated", "error");
      return;
    }

    try {
      const res = await axios.patch(
        `https://local-chef-bazaar.vercel.app/admin/users/fraud/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        Swal.fire("Success", "User marked as fraud", "success");
        fetchUsers(); // refresh table after update
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Manage Users</h2>

      {/* Scrollable table for mobile */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">{user.status}</td>
                <td className="border px-4 py-2">
                  {user.role !== "admin" && user.status !== "fraud" ? (
                    <button
                      onClick={() => handleMakeFraud(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Make Fraud
                    </button>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user._id} className="bg-white shadow p-4 rounded">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Status:</strong> {user.status}</p>
            {user.role !== "admin" && user.status !== "fraud" ? (
              <button
                onClick={() => handleMakeFraud(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
              >
                Make Fraud
              </button>
            ) : (
              <span className="text-gray-500 mt-2 block">N/A</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
