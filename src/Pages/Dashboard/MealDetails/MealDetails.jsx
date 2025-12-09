import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useRole from "../../../Hooks/useRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2";

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = UseAuth();
  const { role } = useRole();

  const [showReviewBox, setShowReviewBox] = useState(false);

  // ==========================
  // 🔥 Fetch Meal Details
  // ==========================
  const { data: meal, isLoading } = useQuery({
    queryKey: ["meal-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/${id}`);
      return res.data;
    },
  });

  //handleOrderNowButton
  //====================
  const handleOrderNow = () => {
    if (!user) {
      navigate("/login", {
        state: { from: `/order`, meal },
      });
    } else {
      navigate("/order", { state: { meal } });
    }
  };

  // ==========================
  // 🔥 Fetch Reviews for This Meal
  // ==========================
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/${id}`);
      return res.data;
    },
  });

  // ==========================
  // ⭐ Add Review Mutation
  // ==========================
  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const res = await axiosSecure.post("/reviews", reviewData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success!", "Review submitted successfully!", "success");
      queryClient.invalidateQueries(["reviews", id]); // refresh reviews
      setShowReviewBox(false);
    },
  });

  // ==========================
  // ❤️ Add to Favorites
  // ==========================
  // const addFavorite = async () => {
  //   if (!user) return navigate("/login");

  //   const favoriteData = {
  //     userEmail: user.email,
  //     mealId: meal._id,
  //     mealName: meal.foodName,
  //     chefId: meal.chefId,
  //     chefName: meal.chefName,
  //     price: meal.price,
  //     addedTime: new Date(),
  //   };

  //   try {
  //     const res = await axiosSecure.post("/favorites", favoriteData);

  //     if (res.data.insertedId) {
  //       Swal.fire("Added!", "Meal added to your favorites.", "success");
  //     } else {
  //       Swal.fire("Info", "This meal is already in favorites.", "info");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const addFavorite = async () => {
    if (!user) return navigate("/login");

    const favoriteData = {
      userEmail: user.email,
      mealId: meal._id,
      mealName: meal.foodName,
      chefId: meal.chefId,
      chefName: meal.chefName,
      price: meal.price,
      addedTime: new Date(),
    };

    try {
      const res = await axiosSecure.post("/favorites", favoriteData);

      if (res.data.inserted) {
        Swal.fire("Added!", "Meal added to your favorites.", "success");
      } else {
        Swal.fire("Info", res.data.message || "This meal is already in favorites.", "info");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add favorite. Try again later.", "error");
    }
  };


  if (isLoading)
    return <p className="text-center mt-10 text-xl">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ====================== */}
      {/* 🔥 Meal Information */}
      {/* ====================== */}
      <h1 className="text-4xl font-bold mb-4">{meal.foodName}</h1>

      <img
        src={meal.foodImage}
        alt={meal.foodName}
        className="w-full h-96 object-cover rounded-lg shadow mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-lg bg-white p-6 rounded-xl shadow text-black">
        <p><strong>Chef Name:</strong> {meal.chefName}</p>
        <p><strong>Chef ID:</strong> {meal.chefId}</p>
        <p><strong>Price:</strong> ${meal.price}</p>
        <p><strong>Rating:</strong> ⭐ {meal.rating}</p>
        <p><strong>Delivery Area:</strong> {meal.deliveryArea}</p>
        <p><strong>Estimated Delivery Time:</strong> {meal.estimatedTime} mins</p>
        <p><strong>Chef Experience:</strong> {meal.experience} years</p>
        <p><strong>Ingredients:</strong> {Array.isArray(meal.ingredients) ? meal.ingredients.join(", ") : meal.ingredients}</p>
        <p className="col-span-2"><strong>Description:</strong> {meal.description}</p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleOrderNow}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Order Now
        </button>

        <button
          onClick={addFavorite}
          className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow"
        >
          ❤️ Add to Favorite
        </button>
      </div>

      {/* Admin Option */}
      {role === "admin" && (
        <button className="mt-4 ml-3 px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700">
          Edit Meal
        </button>
      )}

      {/* ====================== */}
      {/* ⭐ Review Section */}
      {/* ====================== */}
      <div className="mt-10 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-black">Reviews</h2>

        {/* List Reviews */}
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev._id} className="p-4 border rounded-lg mb-4 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={rev.reviewerImage}
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-black">{rev.reviewerName}</p>
                  <p className="text-yellow-500">⭐ {rev.rating}</p>
                </div>
              </div>
              <p className="mt-3 text-black">{rev.comment}</p>
              <p className="text-sm mt-2 text-black">
                {new Date(rev.date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-black">No reviews yet. Be the first!</p>
        )}

        {/* Review Button */}
        <button
          onClick={() => setShowReviewBox(true)}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Give Review
        </button>

        {/* ====================== */}
        {/* ⭐ Review Submission Box */}
        {/* ====================== */}
        {showReviewBox && (
          <div className="mt-5 bg-gray-100 p-5 rounded-lg shadow text-black">
            <h3 className="text-xl font-semibold mb-3">Write Your Review</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const rating = e.target.rating.value;
                const comment = e.target.comment.value;

                reviewMutation.mutate({
                  foodId: id,
                  reviewerName: user.displayName,
                  reviewerImage: user.photoURL,
                  userEmail: user.email,       // <-- add this line
                  rating: Number(rating),
                  comment,
                  date: new Date(),
                });

              }}
            >
              <label className="block mb-2 text-black">Rating (1-5):</label>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                className="border p-2 rounded w-full mb-3"
                required
              />

              <label className="block mb-2 text-black">Comment:</label>
              <textarea
                name="comment"
                className="border p-2 rounded w-full mb-3"
                required
              ></textarea>

              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Review
              </button>

              <button
                type="button"
                onClick={() => setShowReviewBox(false)}
                className="ml-3 px-6 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealDetails;
