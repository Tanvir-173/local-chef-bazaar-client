import React from "react";
import UseAuth from "../../../Hooks/UseAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const UserProfile = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch user info from database
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["user-info", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Send role request
  // const handleRequestRole = async (roleType) => {
  //   try {
  //     const requestData = {
  //       //_id: userInfo?._id,              // REQUIRED
  //       userName: userInfo?.name,
  //       userEmail: userInfo?.email,
  //       requestType: roleType,          // chef or admin
  //       requestStatus: "pending",       // always pending
  //       requestTime: new Date().toISOString(), // exact time
  //     };

  //     await axiosSecure.post("/role-request", requestData);

  //     Swal.fire(
  //       "Success!",
  //       `Your request to become a ${roleType} has been sent!`,
  //       "success"
  //     );
  //   } catch (err) {
  //     Swal.fire("Error!", "Failed to send request.", "error");
  //     console.log(err);
  //   }
  // };
  const handleRequestRole = async (roleType) => {
    try {
      const requestData = {
        userName: userInfo?.name,
        userEmail: userInfo?.email,
        requestType: roleType, // chef or admin
      };

      const res = await axiosSecure.post("/role-request", requestData);

      if (res.data.success) {
        Swal.fire(
          "Success!",
          `Your request to become a ${roleType} has been sent!`,
          "success"
        );
      }
    } catch (err) {
      //  User already made request (expected case)
      if (err.response?.status === 409) {
        Swal.fire(
          "Already Requested",
          err.response.data?.message || "You already sent a role request",
          "info"
        );
        return;
      }

      //  Real error
      Swal.fire(
        "Error!",
        "Failed to send request. Please try again later.",
        "error"
      );

      console.error(err);
    }
  };


  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!userInfo) return <p className="text-center mt-10">User data not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-black">My Profile</h2>

      <div className="flex flex-col items-center mb-6">
        <img
          src={userInfo?.image || user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
          alt="User"
          className="w-32 h-32 rounded-full border-4 border-yellow-500 object-cover"
        />
      </div>

      <div className="space-y-2 text-lg text-black">
        <p><strong>Name:</strong> {userInfo?.name}</p>
        <p><strong>Email:</strong> {userInfo?.email}</p>
        <p><strong>Address:</strong> {userInfo?.address || "N/A"}</p>
        <p><strong>Role:</strong> {userInfo?.role}</p>
        <p><strong>Status:</strong> {userInfo?.status || "active"}</p>

        {userInfo?.role === "chef" && (
          <p><strong>Chef ID:</strong> {userInfo?.chefId}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-4">
        {/* Show only if NOT chef or admin */}
        {userInfo?.role !== "chef" && userInfo?.role !== "admin" && (
          <button
            onClick={() => handleRequestRole("chef")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Be a Chef
          </button>
        )}

        {/* Show if NOT admin */}
        {userInfo?.role !== "admin" && (
          <button
            onClick={() => handleRequestRole("admin")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Be an Admin
          </button>
        )}

        {/* If already admin */}
        {userInfo?.role === "admin" && (
          <p className="text-green-700 font-semibold">You are an Admin</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
