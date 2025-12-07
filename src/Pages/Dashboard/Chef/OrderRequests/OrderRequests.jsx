import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAuth from "../../../../Hooks/UseAuth";
import UserInfo from "../../../../Hooks/UserInfo";   // IMPORTANT
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const OrderRequests = () => {
  const { user } = UseAuth();
  const { userInfo, isLoading } = UserInfo();
  const axiosSecure = useAxiosSecure();

  // -------------------------------
  // ✅ All hooks MUST be placed before any conditional return
  // -------------------------------
  const { data: orders = [], refetch } = useQuery({
    queryKey: ["chef-orders", userInfo?.chefId],
    enabled: !!userInfo?.chefId && !isLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/chef-orders/${userInfo.chefId}`);
      return res.data;
    },
  });

  // -------------------------------
  // Returning UI only after all hooks have executed
  // -------------------------------
  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  // If Chef has no chefId yet (should not happen if admin approved)
  if (!userInfo?.chefId) {
    return <p className="text-center text-red-600">You are not a chef yet.</p>;
  }

  const handleAction = async (orderId, action) => {
    await axiosSecure.patch(`/orders/${orderId}`, {
      orderStatus: action === "approve" ? "accepted" : "rejected",
    });

    Swal.fire(
      "Success!",
      `Order ${action === "approve" ? "accepted" : "rejected"}`,
      "success"
    );

    refetch();
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-2 text-black">Order Requests</h2>
      <p className="mb-4 text-gray-700">
        Total Pending Orders: <strong>{orders.length}</strong>
      </p>

      {orders.length === 0 && <p>No pending orders</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          className="p-4 border rounded flex justify-between items-center mb-2"
        >
          <div className="text-black">
            <p><strong>Food:</strong> {order.foodName || "N/A"}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>User Email:</strong> {order.userEmail}</p>
          </div>

          <div>
            <button
              onClick={() => handleAction(order._id, "approve")}
              className="bg-green-600 px-4 py-2 text-white rounded mr-2"
            >
              Accept
            </button>
            <button
              onClick={() => handleAction(order._id, "reject")}
              className="bg-red-600 px-4 py-2 text-white rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderRequests;
