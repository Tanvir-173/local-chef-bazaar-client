import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import PrivateRoute from "./PrivateRoute";
import MealDetails from "../Pages/Dashboard/MealDetails/MealDetails";
import OrderPage from "../Pages/Private/OrderPage/OrderPage";
import ProfilePage from "../Pages/Private/ProfilePage/ProfilePage";
import DashboardLayout from "../Pages/Dashboard/DashboardLayout/DashboardLayout";
import UserProfile from "../Pages/Dashboard/UserProfile/UserProfile";
import Myorders from "../Pages/Dashboard/MyOrders/Myorders";
import AdminRoute from "./AdminRoute";
import ManageRequests from "../Pages/Dashboard/Admin/ManageRequests/ManageRequests";
import ChefRoute from "./ChefRoute";
import OrderRequests from "../Pages/Dashboard/Chef/OrderRequests/OrderRequests";
import PaymentSuccess from "../Pages/Dashboard/Pyment/PaymentSuccess";
import MyReviews from "../Pages/Dashboard/MyReview/MyReviews";
import FavoriteMeals from "../Pages/Dashboard/FavouriteMeals/FavouriteMeals";
import CreateMeal from "../Pages/Dashboard/Chef/CreateMeal/CreateMeal";
import MyMeals from "../Pages/Dashboard/Chef/MyMeals/MyMeals";
import UpdateMeal from "../Pages/Dashboard/Chef/UpdateMeal/UpdateMeal";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUser/ManageUser";
import PlatformStats from "../Pages/Dashboard/Admin/PlatformStats/PlatformStats";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home
      }
    ]

  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register

      },
      {
        path: "/order",
        element: <PrivateRoute><OrderPage></OrderPage></PrivateRoute>
      },
      {
        path: "/profile",
        element: <PrivateRoute><ProfilePage></ProfilePage></PrivateRoute>,
      },
      

    ]
  },

  {
    path: "dashboard",
    element:<PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
      {
      path:"meals/:id", 
      Component:MealDetails
    },
      {
           path: "profile",
           Compontent:UserProfile 
      },
      {
        path:"orders",
        Component:Myorders
      },
      {
        path:"manage-requests",
        element:<AdminRoute><ManageRequests></ManageRequests></AdminRoute>
      },
      {
        path:'order-requests',
        element:<ChefRoute><OrderRequests></OrderRequests></ChefRoute>
      },
      {
        path:"payment-success",
        Component:PaymentSuccess
      },
      {
        path:'reviews',
        Component:MyReviews
      },
        {
          path:'favorites',
          element:<PrivateRoute><FavoriteMeals></FavoriteMeals></PrivateRoute>
        },
        {
          path:'create-meal',
          element:<ChefRoute><CreateMeal></CreateMeal></ChefRoute>
        },
        {
          path:'my-meals',
          element:<ChefRoute><MyMeals></MyMeals></ChefRoute>
        },
        {
          path: "update-meal/:id",
          element:<ChefRoute><UpdateMeal></UpdateMeal></ChefRoute>
        },
        {
          path: "manage-users",
          element:<AdminRoute><ManageUsers></ManageUsers></AdminRoute>
        },
        {
          path:"statistics",
          element:<AdminRoute><PlatformStats></PlatformStats></AdminRoute>
        }
    ]
    }, // <-- private Meal Details


    
  
]);