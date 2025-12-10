import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Context/AuthContext/AuthContext";
import { useNavigate, useLocation } from "react-router";
import { GoogleAuthProvider, signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../../../Firebase/firebase.init";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";



const Login = () => {
  const { signInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const from = location.state?.from || "/";

  const { register, handleSubmit, formState: { errors } } = useForm();

  //  Save user to DB
  const saveUserToDB = async (user) => {
    try {
      await axiosSecure.post("/users", {
        name: user.displayName || "Unknown",
        email: user.email,
        photoURL: user.photoURL || "",
      });
    } catch (err) {
      console.log("Failed to save user:", err);
    }
  };

  // const onSubmit = async (data) => {
  //   try {
  //     const result = await signInUser(data.email, data.password);
  //     await saveUserToDB(result.user); // save logged-in user to DB
  //     navigate(from, { replace: true });
  //   } catch (error) {
  //     console.error("Login Error:", error.message);
  //     alert(error.message);
  //   }
  // };

  // const handleGoogleLogin = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     await saveUserToDB(result.user); // save Google user to DB
  //     navigate(from, { replace: true });
  //   } catch (error) {
  //     console.error("Google Login Error:", error.message);
  //     alert(error.message);
  //   }
  // };
  const onSubmit = async (data) => {
    try {
      // 1) Check how this email was registered
      const methods = await fetchSignInMethodsForEmail(auth, data.email);

      if (methods.includes("google.com") && !methods.includes("password")) {
        alert("This email was created using Google. Please login with Google.");
        return;
      }

      // 2) Login with email-password normally
      const result = await signInUser(data.email, data.password);

      await saveUserToDB(result.user);
      navigate(from, { replace: true });

    } catch (error) {
      console.error("Login Error:", error.code);

      if (error.code === "auth/invalid-credential") {
        alert("Incorrect password.");
      } else if (error.code === "auth/user-not-found") {
        alert("No account found with this email.");
      } else {
        alert(error.message);
      }
    }
  };


  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      // Attempt Google login
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      // Save to DB and navigate
      await saveUserToDB(googleUser);
      navigate(from, { replace: true });

    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        // Email already exists with password
        const pendingCred = GoogleAuthProvider.credentialFromError(error);
        const email = error.customData.email;
        console.log("Pending credential:", pendingCred);
        console.log("Email:", email);

        alert(`This email is already registered with email/password. Please login using email/password first.`);

        // After the user logs in normally with email/password,
        // you can link the Google credential like this:
        // await linkWithPopup(auth.currentUser, provider);
      } else {
        console.error("Google Login Error:", error.message);
        alert(error.message);
      }
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-400 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border border-gray-400 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-6 h-6"
          />
          Continue with Google
        </button>

        <p className="text-center mt-5 text-gray-600">
          New here? <a href="/register" className="text-green-600 font-semibold hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

