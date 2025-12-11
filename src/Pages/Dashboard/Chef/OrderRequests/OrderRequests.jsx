import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAuth from "../../../../Hooks/UseAuth";
import UserInfo from "../../../../Hooks/UserInfo";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const OrderRequests = () => {
  const { user } = UseAuth();
  const { userInfo, isLoading } = UserInfo();
  const axiosSecure = useAxiosSecure();

  // ===============================
  // Fetch orders for this chef
  // ===============================
  const { data: orders = [], refetch } = useQuery({
    queryKey: ["chef-orders", userInfo?.chefId],
    enabled: !!userInfo?.chefId && !isLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/chef-orders/${userInfo.chefId}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  if (!userInfo?.chefId) {
    return <p className="text-center text-red-600">You are not a chef yet.</p>;
  }

  // ===============================
  // Handle Status Update + Delivery Time
  // ===============================
  const handleStatusChange = async (orderId, newStatus) => {
    const updateData = { orderStatus: newStatus };

    // When delivered → add deliveryTime
    if (newStatus === "delivered") {
      updateData.deliveryTime = new Date();
    }

    await axiosSecure.patch(`/orders/${orderId}`, updateData);

    Swal.fire("Success!", `Order ${newStatus}`, "success");
    refetch();
  };

  // Status-based button disable rules
  const isDisabled = (order, buttonType) => {
    const status = order.orderStatus;

    if (status === "cancelled" || status === "delivered") return true;

    if (status === "accepted" && buttonType === "accept") return true;
    if (status === "accepted" && buttonType === "cancel") return true;

    if (status === "pending" && buttonType === "deliver") return true;

    return false;
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-black">Order Requests</h2>
      <p className="mb-4 text-gray-700">
        Total Orders: <strong>{orders.length}</strong>
      </p>

      {orders.length === 0 && <p>No pending orders</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          className="p-4 mb-4 border rounded-lg shadow bg-white"
        >
          <div className="text-black mb-3">
            <p><strong>Food:</strong> {order.foodName}</p>
            <p><strong>Price:</strong> ${order.price}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Status:</strong> {order.orderStatus}</p>
            <p><strong>User Email:</strong> {order.userEmail}</p>
            <p><strong>Order Time:</strong> {new Date(order.orderTime).toLocaleString()}</p>
            <p><strong>User Address:</strong> {order.userAddress}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>

            {/* Show Delivery Time if exists */}
            {order.deliveryTime && (
              <p><strong>Delivery Time:</strong> {new Date(order.deliveryTime).toLocaleString()}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {/* Cancel */}
            <button
              onClick={() => handleStatusChange(order._id, "cancelled")}
              disabled={isDisabled(order, "cancel")}
              className={`px-4 py-2 rounded text-white 
                ${isDisabled(order, "cancel") ? "bg-gray-400" : "bg-red-600"}`}
            >
              Cancel
            </button>

            {/* Accept */}
            <button
              onClick={() => handleStatusChange(order._id, "accepted")}
              disabled={isDisabled(order, "accept")}
              className={`px-4 py-2 rounded text-white 
                ${isDisabled(order, "accept") ? "bg-gray-400" : "bg-green-600"}`}
            >
              Accept
            </button>

            {/* Deliver */}
            <button
              onClick={() => handleStatusChange(order._id, "delivered")}
              disabled={isDisabled(order, "deliver")}
              className={`px-4 py-2 rounded text-white 
                ${isDisabled(order, "deliver") ? "bg-gray-400" : "bg-blue-600"}`}
            >
              Deliver
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderRequests;
