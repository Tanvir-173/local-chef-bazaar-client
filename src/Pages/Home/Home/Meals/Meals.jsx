import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UseAuth from "../../../../Hooks/UseAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

 const fetchMeals = async (page = 1) => {
  try {
    const res = await axiosSecure.get("/meals", {
      params: { page, limit: 10 },
    });
    setMeals(res.data.meals || []); // ensure meals is always an array
    setTotalPages(res.data.totalPages || 1);
    setCurrentPage(res.data.currentPage || 1);
  } catch (err) {
    console.error("Error fetching meals:", err);
    setMeals([]); // fallback
  }
};


  useEffect(() => {
    fetchMeals(currentPage);
  }, [currentPage]);

  const handleSort = () => {
    const sorted = [...meals].sort((a, b) =>
      sortAsc ? a.price - b.price : b.price - a.price
    );
    setMeals(sorted);
    setSortAsc(!sortAsc);
  };

  const handleViewDetails = (id) => {
    if (user) {
      navigate(`/dashboard/meals/${id}`);
    } else {
      navigate("/login");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Daily Meals</h1>
        <button
          onClick={handleSort}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Sort by Price {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <div key={meal._id} className="border rounded-lg shadow p-4">
            <img
              src={meal.foodImage}
              alt={meal.foodName}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-3">{meal.foodName}</h2>
            <p>Chef: {meal.chefName} ({meal.chefId})</p>
            <p>Price: ${meal.price}</p>
            <p>Rating: ⭐ {meal.rating}</p>
            <p>Delivery Area: {meal.deliveryArea}</p>
            <button
              onClick={() => handleViewDetails(meal._id)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              See Details
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-black"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-black' : 'bg-gray-200 text-black'}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-black"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Meals;
