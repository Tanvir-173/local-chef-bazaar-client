import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UseAuth from "../../../../Hooks/UseAuth";
 // your auth hook

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();
  const { user } = UseAuth(); // check if user is logged in

  useEffect(() => {
    fetch("http://localhost:3000/meals") // call your backend API
      .then((res) => res.json())
      .then((data) => setMeals(data))
      .catch((err) => console.error("Error fetching meals:", err));
  }, []);

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
    </div>
  );
};

export default Meals;
