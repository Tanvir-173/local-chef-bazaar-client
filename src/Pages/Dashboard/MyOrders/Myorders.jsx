import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAuth from "../../../Hooks/UseAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

// =====================
// MAIN ORDER PAGE
// =====================
const Myorders = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch all orders (paid and pending)
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/${user?.email}`);
      return res.data; // Return all orders
    },
    enabled: !!user?.email,
  });

  // Handle payment
  const handlePayment = async (order) => {
    console.log("ORDER:", order);
    console.log("PRICE:", order.price);
    console.log("FOODNAME:", order.foodName);

    try {
      const res = await axiosSecure.post("/create-checkout-session", {
        price: order.price,
        orderId: order._id,
        userEmail: order.userEmail,
      });

      console.log(res.data);
      window.location.href = res.data.url;
    } catch (error) {
      console.error("Payment Error:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: error.message || "Something went wrong!",
      });
    }
  };

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-black">
        My Orders
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
        {orders.map((order) => (
          <div
            key={order._id}
            className={`p-4 shadow rounded ${
              order.paymentStatus === "paid" ? "bg-green-100" : "bg-white"
            }`}
          >
            {console.log(order)}
            <h3 className="text-xl font-bold">{order.foodName}</h3>

            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Price:</strong> ${order.price}
            </p>
            <p>
              <strong>Quantity:</strong> {order.quantity}
            </p>
            <p>
              <strong>Delivery Time:</strong> {order.deliveryTime}
            </p>
            <p>
              <strong>Chef Name:</strong> {order.chefName}
            </p>
            <p>
              <strong>Chef ID:</strong> {order.chefId}
            </p>
            <p>
              <strong>Payment Status:</strong> {order.paymentStatus}
            </p>

            {/* CONDITIONAL PAYMENT BUTTON */}
            {order.orderStatus === "accepted" && order.paymentStatus === "Pending" ? (
              <button
                className="mt-4 w-full bg-green-600 py-2 rounded text-white hover:bg-green-700 transition"
                onClick={() => handlePayment(order)}
              >
                Pay
              </button>
            ) : (
              <button
                className="mt-4 w-full bg-gray-400 py-2 rounded text-white opacity-80 cursor-not-allowed"
                disabled
              >
                {order.paymentStatus === "paid" ? "Paid" : "Pay"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Myorders;
