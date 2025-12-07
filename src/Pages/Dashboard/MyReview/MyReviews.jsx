import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";

const MyReviews = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const [editingReview, setEditingReview] = useState(null);

  const { data: reviews = [], refetch } = useQuery({
    queryKey: ["userReviews", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Delete review
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.delete(`/reviews/${id}`);
        Swal.fire("Deleted!", "Your review has been deleted.", "success");
        refetch();
      }
    });
  };

  // Update review
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { rating, comment } = e.target.elements;
    await axiosSecure.patch(`/reviews/${editingReview._id}`, {
      rating: rating.value,
      comment: comment.value,
    });
    Swal.fire("Updated!", "Your review has been updated.", "success");
    setEditingReview(null);
    refetch();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">My Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div key={review._id} className="p-4 bg-white shadow rounded text-black">
            <h3 className="text-xl font-bold">{review.foodName}</h3>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Date:</strong> {new Date(review.date).toLocaleString()}</p>

            <div className="mt-4 flex gap-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDelete(review._id)}
              >
                Delete
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setEditingReview(review)}
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Update Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded shadow-lg w-[400px] text-black"
          >
            <h3 className="text-xl font-bold mb-4">Update Review</h3>
            <label className="block mb-2">
              Rating:
              <input
                type="number"
                name="rating"
                defaultValue={editingReview.rating}
                min={1}
                max={5}
                className="border p-2 w-full rounded mt-1"
                required
              />
            </label>
            <label className="block mb-4">
              Comment:
              <textarea
                name="comment"
                defaultValue={editingReview.comment}
                className="border p-2 w-full rounded mt-1"
                required
              />
            </label>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setEditingReview(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
