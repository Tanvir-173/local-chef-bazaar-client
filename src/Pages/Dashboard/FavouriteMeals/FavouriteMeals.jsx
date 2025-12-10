import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import UseAuth from "../../../Hooks/UseAuth";

const FavoriteMeals = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();

  const { data: favorites = [], refetch } = useQuery({
    queryKey: ["favorites", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/favorites/${user.email}`);
      return res.data;
    },
    enabled: !!user,
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Remove from favorites?",
      text: "This meal will be removed from your list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.delete(`/favorites/${id}`);

        Swal.fire("Removed!", "Meal removed from favorites.", "success");

        refetch();
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-black">My Favorite Meals</h2>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-600 text-black">No favorite meals yet.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="text-black">
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Meal Name</th>
                  <th className="p-3">Chef Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Date Added</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((fav) => (
                  <tr key={fav._id} className="border-b text-black">
                    <td className="p-3">{fav.mealName}</td>
                    <td className="p-3">{fav.chefName}</td>
                    <td className="p-3">${fav.price}</td>
                    <td className="p-3">{new Date(fav.addedTime).toLocaleDateString()}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(fav._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {favorites.map((fav) => (
              <div key={fav._id} className="bg-white shadow p-4 rounded border border-gray-200">
                <p><strong>Meal Name:</strong> {fav.mealName}</p>
                <p><strong>Chef Name:</strong> {fav.chefName}</p>
                <p><strong>Price:</strong> ${fav.price}</p>
                <p><strong>Date Added:</strong> {new Date(fav.addedTime).toLocaleDateString()}</p>
                <button
                  onClick={() => handleDelete(fav._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2 w-full"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoriteMeals;
