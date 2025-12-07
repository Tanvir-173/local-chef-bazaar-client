import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
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

  // const { data: orders = [], isLoading, refetch } = useQuery({
  //   queryKey: ["orders", user?.email],
  //   queryFn: async () => {
  //     const res = await axiosSecure.get(`/orders/${user?.email}`);
  //     return res.data;
  //   },
  //   enabled: !!user?.email,
  // });
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/${user?.email}`);
      return res.data.filter(order => order.paymentStatus !== "paid");
    },
    enabled: !!user?.email,
  });


  // const hndlePayment = async (order) => {

  //   const paymentInfo ={
  //          price: order.price,
  //   }

  //   // 1. Create payment intent
  //   const res = await axiosSecure.post("/create-checkout-session",  paymentInfo );


  //   console.log(res.data)
  // }
  const handlePayment = async (order) => {
    console.log("ORDER:", order);
    console.log("PRICE:", order.price);
    console.log("FOODNAME:", order.foodName);

    const res = await axiosSecure.post("/create-checkout-session", {
      price: order.price,
      orderId: order._id,
      userEmail: order.userEmail,

    });

    console.log(res.data);
    window.location.href = res.data.url
  };


  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-black">
        My Orders
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
        {orders.map((order) => (

          <div key={order._id} className="p-4 bg-white shadow rounded">
            {console.log(order)}
            <h3 className="text-xl font-bold">{order.foodName}</h3>

            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Price:</strong> ${order.price}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Delivery Time:</strong> {order.deliveryTime}</p>
            <p><strong>Chef Name:</strong> {order.chefName}</p>
            <p><strong>Chef ID:</strong> {order.chefId}</p>
            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>

            {/* CONDITIONAL PAYMENT BUTTON */}
            {order.orderStatus === "accepted" && order.paymentStatus === "Pending" ? (
              <button
                className="mt-4 w-full bg-green-600 py-2 rounded text-white"
                onClick={() => handlePayment(order)}
              >
                Pay
              </button>
            ) : (
              <button className="mt-4 w-full bg-gray-400 py-2 rounded text-white opacity-60">
                Pay
              </button>
            )}

          </div>
        ))}
      </div>

      {/* PAYMENT POPUP MODAL */}
      {selectedOrder && (
        <PaymentModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default Myorders;

// =====================
// PAYMENT MODAL WRAPPER
// =====================
// const PaymentModal = ({ order, onClose, refetch }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded shadow-lg w-[400px]">
//         <h3 className="text-xl font-bold mb-4 text-black">Pay for {order.foodName}</h3>

//         <Elements stripe={stripePromise}>
//           <PaymentForm order={order} onClose={onClose} refetch={refetch} />
//         </Elements>

//         <button
//           className="mt-4 w-full bg-red-500 text-white py-2 rounded"
//           onClick={onClose}
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// // =====================
// // PAYMENT FORM
// // =====================
// const PaymentForm = ({ order, onClose, refetch }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const axiosSecure = useAxiosSecure();

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     const paymentInfo ={
//            price: order.price,
//     }

//     // 1. Create payment intent
//     const res = await axiosSecure.post("/create-checkout-session",  paymentInfo );

//     const clientSecret = res.data.clientSecret;
//     console.log(res.data)

//     // 2. Confirm payment
//     const paymentResult = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: elements.getElement(CardElement),
//       },
//     });

//     if (paymentResult.error) {
//       Swal.fire("Payment Failed", paymentResult.error.message, "error");
//       return;
//     }

//     if (paymentResult.paymentIntent.status === "succeeded") {
//       // 3. Save payment history
//       await axiosSecure.post("/payments", {
//         orderId: order._id,
//         userEmail: order.userEmail,
//         price: order.price,
//         foodName: order.foodName,
//         date: new Date(),
//         transactionId: paymentResult.paymentIntent.id,
//       });

//       // 4. Update order payment status
//       await axiosSecure.patch(`/orders/${order._id}/paid`);

//       Swal.fire("Success!", "Payment successful!", "success");

//       refetch();
//       onClose();

//       // 5. Redirect to success page
//       window.location.href = "/payment-success";
//     }
//   };

//   return (
//     <form>
//       <CardElement className="border p-3 rounded mt-2" />

//       <button onClick={handlePayment}
//         type="submit"
//         className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//       >
//         Pay Now
//       </button>
//     </form>
//   );
// };
