// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import Swal from "sweetalert2";
// import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

// const ManageRequests = () => {
//   const axiosSecure = useAxiosSecure();

//   // Fetch all requests
//   const { data: requests = [], refetch } = useQuery({
//     queryKey: ["role-requests"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/role-requests");
//       console.log(res.data)

//       return res.data;
//     },
//   });

//   const handleAction = async (userEmail, action) => {
//     try {
//       const res = await axiosSecure.patch(`/role-request/${userEmail}`, { action });
//       if (res.data.success) {
//         Swal.fire(
//           "Success!",
//           `Request has been ${action === "approve" ? "approved" : "rejected"}`,
//           "success"
//         );
//         refetch();
//       }
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Action failed. Please try again.", "error");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-3xl font-bold mb-6 text-black">Manage Role Requests</h2>

//       {requests.length === 0 && (
//         <p className="text-gray-600 text-black">No pending requests</p>
//       )}

//       {/* Desktop Table */}
//       <div className="overflow-x-auto hidden md:block">
//         <table className="min-w-full border border-gray-300">
//           <thead className="bg-gray-100 text-black">
//             <tr className="text-center">
//               <th className="px-4 py-2 border">Name</th>
//               <th className="px-4 py-2 border">Email</th>
//               <th className="px-4 py-2 border">Request Type</th>
//               <th className="px-4 py-2 border">Status</th>
//               <th className="px-4 py-2 border">Request Time</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map((req) => (
//               <tr key={req._id} className="text-center text-black">
//                 <td className="px-4 py-2 border">{req.userName || "N/A"}</td>
//                 <td className="px-4 py-2 border">{req.userEmail}</td>
//                 <td className="px-4 py-2 border capitalize">{req.requestType}</td>
//                 <td className="px-4 py-2 border capitalize">{req.requestStatus}</td>
//                 <td className="px-4 py-2 border">
//                   {new Date(req.requestTime).toLocaleString()}
//                 </td>
//                 <td className="px-4 py-2 border space-x-2">
//                   <button
//                     className={`px-3 py-1 rounded text-white ${req.requestStatus === "pending"
//                         ? "bg-green-600 hover:bg-green-700"
//                         : "bg-gray-400 cursor-not-allowed"
//                       }`}
//                     onClick={() => handleAction(req.userEmail, "approve")}
//                     disabled={req.requestStatus !== "pending"}
//                   >
//                     Approve
//                   </button>
//                   <button
//                     className={`px-3 py-1 rounded text-white ${req.requestStatus === "pending"
//                         ? "bg-red-600 hover:bg-red-700"
//                         : "bg-gray-400 cursor-not-allowed"
//                       }`}
//                     onClick={() => handleAction(req.userEmail, "reject")}
//                     disabled={req.requestStatus !== "pending"}
//                   >
//                     Reject
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="md:hidden space-y-4">
//         {requests.map((req) => (
//           <div key={req._id} className="bg-white shadow p-4 rounded border border-gray-200">
//             <p><strong>Name:</strong> {req.userName || "N/A"}</p>
//             <p><strong>Email:</strong> {req.userEmail}</p>
//             <p><strong>Request Type:</strong> {req.requestType}</p>
//             <p><strong>Status:</strong> {req.requestStatus}</p>
//             <p><strong>Request Time:</strong> {new Date(req.requestTime).toLocaleString()}</p>
//             <div className="mt-2 flex space-x-2">
//               <button
//                 className={`px-3 py-1 rounded text-white ${req.requestStatus === "pending"
//                     ? "bg-green-600 hover:bg-green-700"
//                     : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                 onClick={() => handleAction(req.userEmail, "approve")}
//                 disabled={req.requestStatus !== "pending"}
//               >
//                 Approve
//               </button>
//               <button
//                 className={`px-3 py-1 rounded text-white ${req.requestStatus === "pending"
//                     ? "bg-red-600 hover:bg-red-700"
//                     : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                 onClick={() => handleAction(req.userEmail, "reject")}
//                 disabled={req.requestStatus !== "pending"}
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


// export default ManageRequests;
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const ManageRequests = () => {
  const axiosSecure = useAxiosSecure();

  // Track processed requests (by email)
  const [processedMap, setProcessedMap] = useState({});

  // Fetch all requests
  const { data: requests = [], refetch } = useQuery({
    queryKey: ["role-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/role-requests");
      return res.data;
    },
  });

  const handleAction = async (userEmail, action) => {
    try {
      const res = await axiosSecure.patch(
        `/role-request/${userEmail}`,
        { action }
      );

      if (res.data.success) {
        // Mark this email as processed (count/flag)
        setProcessedMap((prev) => ({
          ...prev,
          [userEmail]: true,
        }));

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

  // Helper: check if buttons should be disabled
  const isDisabled = (req) =>
    req.requestStatus !== "pending" || processedMap[req.userEmail];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-black">
        Manage Role Requests
      </h2>

      {requests.length === 0 && (
        <p className="text-gray-600">No pending requests</p>
      )}

      {/* Desktop Table */}
      <div className="overflow-x-auto hidden md:block">
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
                <td className="px-4 py-2 border">
                  {req.userName || "N/A"}
                </td>
                <td className="px-4 py-2 border">{req.userEmail}</td>
                <td className="px-4 py-2 border capitalize">
                  {req.requestType}
                </td>
                <td className="px-4 py-2 border capitalize">
                  {req.requestStatus}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(req.requestTime).toLocaleString()}
                </td>
                <td className="px-4 py-2 border space-x-2">
                  {/* Approve */}
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      !isDisabled(req)
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      handleAction(req.userEmail, "approve")
                    }
                    disabled={isDisabled(req)}
                  >
                    Approve
                  </button>

                  {/* Reject */}
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      !isDisabled(req)
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      handleAction(req.userEmail, "reject")
                    }
                    disabled={isDisabled(req)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white shadow p-4 rounded border"
          >
            <p><strong>Name:</strong> {req.userName || "N/A"}</p>
            <p><strong>Email:</strong> {req.userEmail}</p>
            <p><strong>Request Type:</strong> {req.requestType}</p>
            <p><strong>Status:</strong> {req.requestStatus}</p>
            <p>
              <strong>Request Time:</strong>{" "}
              {new Date(req.requestTime).toLocaleString()}
            </p>

            <div className="mt-2 flex space-x-2">
              <button
                className={`px-3 py-1 rounded text-white ${
                  !isDisabled(req)
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={() =>
                  handleAction(req.userEmail, "approve")
                }
                disabled={isDisabled(req)}
              >
                Approve
              </button>

              <button
                className={`px-3 py-1 rounded text-white ${
                  !isDisabled(req)
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={() =>
                  handleAction(req.userEmail, "reject")
                }
                disabled={isDisabled(req)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRequests;
