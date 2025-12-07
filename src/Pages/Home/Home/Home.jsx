import React from 'react';

// import  { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import axios from "axios";
import Meals from './Meals/Meals';

// Placeholder card component for meals
// const MealCard = ({ meal }) => (
//   <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
//     <img src={meal.foodImage} alt={meal.foodName} className="w-full h-40 object-cover rounded-lg mb-2" />
//     <h3 className="font-bold text-lg">{meal.foodName}</h3>
//     <p>Price: ${meal.price}</p>
//     <p>Chef: {meal.chefName}</p>
//   </div>
// );

// Placeholder review component
const ReviewCard = ({ review }) => (
  <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
    <p className="font-semibold">{review.reviewerName}</p>
    <p>Rating: {review.rating} / 5</p>
    <p>{review.comment}</p>
  </div>
);

const Home = () => {
  // const [meals, setMeals] = useState([]);
  // const [reviews, setReviews] = useState([]);

  // useEffect(() => {
  //   // Fetch meals from server (replace with your server URL)
  //   axios.get("https://your-server.com/meals?limit=6")
  //     .then(res => setMeals(res.data))
  //     .catch(err => console.log(err));

    // Fetch reviews from server
  //   axios.get("https://your-server.com/reviews?limit=6")
  //     .then(res => setReviews(res.data))
  //     .catch(err => console.log(err));
  // }, []);

  return (
    <div className="space-y-16">
      
      {/* Hero Section */}
      <motion.div 
        className="bg-green-600 text-white py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to LocalChefBazaar</h1>
        <p className="text-xl">Fresh, homemade meals delivered from local chefs to your door</p>
      </motion.div>

      {/* Daily Meals Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Daily Meals</h2>
        
          
           <Meals></Meals>
          
        
      </section>

      {/* Customer Reviews Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Reviews</h2>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reviews.map(review => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div> */}
      </section>

      {/* Extra Section (You can add anything you like) */}
      <section className="bg-gray-200 py-16 text-center text-black">
        <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
        <p className="max-w-2xl mx-auto">We connect you with local chefs to enjoy fresh, homemade meals. Quality, taste, and convenience delivered to your doorstep.</p>
      </section>
    </div>
  );
};

export default Home;
