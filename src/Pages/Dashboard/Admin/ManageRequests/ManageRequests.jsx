import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const ManageRequests = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all requests
  const { data: requests = [], refetch } = useQuery({
    queryKey: ["role-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/role-requests");
      return res.data;
    },
  });

  const handleAction = async (id, action) => {
    try {
      const res = await axiosSecure.patch(`/role-request/${id}`, { action });
      if (res.data.success) {
        Swal.fire(
          "Success!",
          `Request has been ${action === "approve" ? "approved" : "rejected"}`,
          "success"
        );
        refetch();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Action failed. Please try again.", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-black">Manage Role Requests</h2>

      {requests.length === 0 && (
        <p className="text-gray-600 text-black">No pending requests</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 text-black">
            <tr className="text-center">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Request Type</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Request Time</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="text-center text-black">
                <td className="px-4 py-2 border">{req.userName || "N/A"}</td>
                <td className="px-4 py-2 border">{req.userEmail}</td>
                <td className="px-4 py-2 border capitalize">{req.requestType}</td>
                <td className="px-4 py-2 border capitalize">{req.requestStatus}</td>
                <td className="px-4 py-2 border">
                  {new Date(req.requestTime).toLocaleString()}
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      req.requestStatus === "pending"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={() => handleAction(req._id, "approve")}
                    disabled={req.requestStatus !== "pending"}
                  >
                    Approve
                  </button>
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      req.requestStatus === "pending"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={() => handleAction(req._id, "reject")}
                    disabled={req.requestStatus !== "pending"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRequests;
