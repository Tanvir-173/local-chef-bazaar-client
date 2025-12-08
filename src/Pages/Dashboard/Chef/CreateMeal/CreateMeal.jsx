import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import UseAuth from "../../../../Hooks/UseAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

const CreateMeal = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      // ⬆ Upload Image First
      const formData = new FormData();
      formData.append("image", data.foodImage[0]);

      const imgResponse = await axios.post(image_API_URL, formData);
      const imageURL = imgResponse.data.data.display_url;

      // ⬆ Prepare Meal Data
      const mealData = {
        foodName: data.foodName,
        chefName: data.chefName,
        foodImage: imageURL,
        price: parseFloat(data.price),
        rating: 0,
        ingredients: data.ingredients.split(","),
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
        chefId: data.chefId,
        userEmail: user.email,
        createdAt: new Date(),
      };

      // ⬆ Save meal in DB
      const result = await axiosSecure.post("/meals", mealData);

      if (result.data.insertedId) {
        toast.success("Meal created successfully!");
        reset();
      }

    } catch (error) {
      toast.error("Failed to create meal");
      console.log(error)
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-black">Create New Meal</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <input {...register("foodName")} placeholder="Food Name" className="input" required />

        <input {...register("chefName")} placeholder="Chef Name" className="input" required />

        <input type="file" {...register("foodImage")} className="file-input" required />

        <input type="number" {...register("price")} placeholder="Price" className="input" required />

        <input {...register("ingredients")} placeholder="Ingredients (comma separated)" className="input" required />

        <input {...register("estimatedDeliveryTime")} placeholder="Estimated Delivery Time" className="input" required />

        <textarea {...register("chefExperience")} placeholder="Chef Experience" className="textarea" required />

        <input {...register("chefId")} placeholder="Chef ID" className="input" required />

        <input value={user?.email} readOnly className="input" />

        <button className="btn btn-primary w-full">Create Meal</button>
      </form>
    </div>
  );
};

export default CreateMeal;
