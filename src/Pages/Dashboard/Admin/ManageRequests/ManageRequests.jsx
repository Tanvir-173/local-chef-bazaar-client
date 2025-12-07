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

  // Approve/reject handler
  const handleAction = async (id, action) => {
    const res = await axiosSecure.patch(`/role-request/${id}`, { action });

    if (res.data.success) {
      Swal.fire(
        "Success!",
        `Request has been ${action === "approve" ? "approved" : "rejected"}`,
        "success"
      );
      refetch();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-black">Manage Role Requests</h2>

      {requests.length === 0 && (
        <p className="text-gray-600 text-black">No pending requests</p>
      )}

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="p-4 bg-white shadow rounded border flex justify-between items-center"
          >
            <div className="text-black">
              <p><strong>Name:</strong> {req.userName}</p>
              <p><strong>Email:</strong> {req.userEmail}</p>
              <p><strong>Request Type:</strong> {req.requestType}</p>
              <p><strong>Status:</strong> {req.requestStatus}</p>
              <p><strong>Time:</strong> {new Date(req.requestTime).toLocaleString()}</p>
            </div>

            {req.requestStatus === "pending" && (
              <div className="space-x-3">
                <button
                  onClick={() => handleAction(req._id, "approve")}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleAction(req._id, "reject")}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRequests;
