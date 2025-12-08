import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const UpdateMeal = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue } = useForm();

  // Fetch meal data and set default values
  useEffect(() => {
    axiosSecure.get(`/meals/${id}`).then(res => {
      const meal = res.data;

      // Populate form fields with fetched data
      setValue("foodName", meal.foodName);
      setValue("chefName", meal.chefName);
      setValue("price", meal.price);
      setValue("ingredients", meal.ingredients.join(", "));
      setValue("estimatedDeliveryTime", meal.estimatedDeliveryTime);
      setValue("chefExperience", meal.chefExperience);
      setValue("chefId", meal.chefId);

      setLoading(false);
    }).catch(err => {
      toast.error("Failed to load meal data");
      console.log(err);
    });
  }, [id, axiosSecure, setValue]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const updatedMeal = {
        foodName: data.foodName,
        chefName: data.chefName,
        price: parseFloat(data.price),
        ingredients: data.ingredients.split(",").map(item => item.trim()),
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
        chefId: data.chefId,
      };

      const res = await axiosSecure.put(`/meals/${id}`, updatedMeal);

      if (res.data.modifiedCount > 0) {
        toast.success("Meal updated successfully!");
        navigate("/dashboard/my-meals");
      } else {
        toast("No changes made");
      }
    } catch (err) {
      toast.error("Failed to update meal");
      console.log(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-black">Update Meal</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <input
          {...register("foodName", { required: true })}
          placeholder="Food Name"
          className="input input-bordered w-full"
        />

        <input
          {...register("chefName", { required: true })}
          placeholder="Chef Name"
          className="input input-bordered w-full"
        />

        <input
          type="number"
          {...register("price", { required: true, min: 0 })}
          placeholder="Price"
          className="input input-bordered w-full"
        />

        <input
          {...register("ingredients", { required: true })}
          placeholder="Ingredients (comma separated)"
          className="input input-bordered w-full"
        />

        <input
          {...register("estimatedDeliveryTime", { required: true })}
          placeholder="Estimated Delivery Time"
          className="input input-bordered w-full"
        />

        <textarea
          {...register("chefExperience", { required: true })}
          placeholder="Chef Experience"
          className="textarea textarea-bordered w-full"
        />

        <input
          {...register("chefId", { required: true })}
          placeholder="Chef ID"
          className="input input-bordered w-full"
        />

        <button type="submit" className="btn btn-primary w-full">
          Update Meal
        </button>
      </form>
    </div>
  );
};

export default UpdateMeal;
