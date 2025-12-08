import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import UseAuth from "../../../../Hooks/UseAuth";

const MyMeals = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();
  const [meals, setMeals] = useState([]);

  // Fetch all meals of the logged-in chef
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/meals/chef/${user.email}`)
        .then(res => setMeals(res.data))
        .catch(err => console.log(err));
    }
  }, [user, axiosSecure]);

  // Delete Meal
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this meal?");
    if (!confirmDelete) return;

    try {
      const res = await axiosSecure.delete(`/meals/${id}`);

      if (res.data.deletedCount > 0) {
        toast.success("Meal deleted successfully!");
        setMeals(meals.filter(meal => meal._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete meal");
      console.log(err)
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-black">My Meals</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meals.map(meal => (
          <div key={meal._id} className="bg-white p-4 rounded-xl shadow-md text-black">

            <img src={meal.foodImage} alt={meal.foodName} className="w-full h-48 object-cover rounded-lg" />

            <h3 className="text-xl font-bold mt-3">{meal.foodName}</h3>

            <p><span className="font-semibold">Price:</span> ${meal.price}</p>
            <p><span className="font-semibold">Rating:</span> {meal.rating}</p>
            <p><span className="font-semibold">Ingredients:</span> {meal.ingredients.join(", ")}</p>
            <p><span className="font-semibold">Delivery Time:</span> {meal.estimatedDeliveryTime}</p>

            <p><span className="font-semibold">Chef Name:</span> {meal.chefName}</p>
            <p><span className="font-semibold">Chef ID:</span> {meal.chefId}</p>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDelete(meal._id)}
                className="btn btn-error text-white"
              >
                Delete
              </button>

              <Link to={`/dashboard/update-meal/${meal._id}`}>
                <button className="btn btn-primary text-white">Update</button>
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyMeals;
