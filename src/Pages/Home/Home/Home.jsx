import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Meals from './Meals/Meals';
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import chef from '../../../assets/chef.jpg'


const ReviewCard = ({ review }) => (
  <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-black">
    <p className="font-semibold">{review.reviewerName}</p>
    <p>Food:{review.foodName}</p>
    <p>Rating: {review.rating} / 5</p>
    <p>{review.comment}</p>
  </div>
);

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        const res = await axiosSecure.get("/reviews/top");
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching top reviews:", err);
      }
    };
    fetchTopReviews();
  }, [axiosSecure]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      {/* <motion.div 
        className="bg-green-600 text-white py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to LocalChefBazaar</h1>
        <p className="text-xl">Fresh, homemade meals delivered from local chefs to your door</p>
      </motion.div> */}
      <motion.div
        className="text-white py-20 text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${chef})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to LocalChefBazaar</h1>
        <p className="text-xl">
          Fresh, homemade meals delivered from local chefs to your door
        </p>
      </motion.div>


      {/* Daily Meals Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Daily Meals</h2>
        <Meals />
      </section>

      {/* Top Customer Reviews */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Top Customer Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reviews.length > 0 ? (
            reviews.map(review => <ReviewCard key={review._id.toString()} review={review} />)
          ) : (
            <p className="text-center col-span-full">No reviews available.</p>
          )}
        </div>
      </section>

      {/* Extra Section */}
      <section className="bg-gray-200 py-16 text-center text-black">
        <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
        <p className="max-w-2xl mx-auto">
          We connect you with local chefs to enjoy fresh, homemade meals. Quality, taste, and convenience delivered to your doorstep.
        </p>
      </section>
    </div>
  );
};

export default Home;
