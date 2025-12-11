import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import UseAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const OrderPage = () => {
  const { user } = UseAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Meal data received from MealDetails page
  const meal = location.state?.meal;

  const [quantity, setQuantity] = useState(1);
  const [userAddress, setUserAddress] = useState("");

  if (!meal) {
    return <p className="text-center mt-10 text-red-500">No meal selected</p>;
  }

  const totalPrice = quantity * Number(meal.price);

  const handleConfirmOrder = () => {
    Swal.fire({
      title: `Your total price is $${totalPrice}`,
      text: "Do you want to confirm the order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Confirm",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const orderData = {
          foodId: meal._id,
          mealName: meal.foodName,
          price: meal.price,
          quantity,
          chefId: meal.chefId,
          chefName: meal.chefName, // ← added chefName here
          userEmail: user.email,
          userAddress,
          orderStatus: "pending",
          paymentStatus: "Pending",
          orderTime: new Date(),
        };

        try {
          await axiosSecure.post("/orders", orderData);
          Swal.fire("Success!", "Order placed successfully!", "success");
          navigate("/");
        } catch (err) {
          Swal.fire("Error!", "Failed to place order", "error");
          console.log(err);
        }
      }
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10 text-black">
      <h2 className="text-2xl font-bold mb-4">{meal.foodName}</h2>

      <p><strong>Price:</strong> ${meal.price}</p>
      <p><strong>Chef:</strong> {meal.chefName} ({meal.chefId})</p>
      <p><strong>Email:</strong> {user?.email}</p>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Delivery Address:</label>
        <textarea
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter your address"
        />
      </div>

      <p className="mt-4 font-semibold">Total Price: ${totalPrice}</p>

      <button
        onClick={handleConfirmOrder}
        disabled={!userAddress || quantity < 1}
        className="mt-6 w-full bg-green-600 py-2 rounded hover:bg-green-700 transition text-white"
      >
        Confirm Order
      </button>
    </div>
  );
};

export default OrderPage;
