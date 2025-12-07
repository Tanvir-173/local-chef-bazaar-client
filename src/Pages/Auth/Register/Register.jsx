import React from 'react';
import { useForm } from 'react-hook-form';
import UseAuth from '../../../Hooks/UseAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = UseAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    // ✅ Save user to DB
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

    const handleRegistration = (data) => {
        const profileImg = data.photo[0];

        registerUser(data.email, data.password)
            .then(result => {
                const formData = new FormData();
                formData.append('image', profileImg);

                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`

                axios.post(image_API_URL, formData)
                    .then(async res => {
                        const userProfile = {
                            displayName: data.name,
                            photoURL: res.data.data.url
                        }

                        await updateUserProfile(userProfile);
                        await saveUserToDB(result.user); // save user to DB
                        navigate(location.state || '/');
                    })
                    .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
    }

    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className="text-3xl text-center">Welcome to Zap Shift</h3>
            <p className='text-center'>Please Register</p>
            <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
                <fieldset className="fieldset">
                    <label className="label">Name</label>
                    <input type="text" {...register('name', { required: true })} className="input" placeholder="Your Name" />
                    {errors.name && <p className='text-red-500'>Name is required.</p>}

                    <label className="label">Photo</label>
                    <input type="file" {...register('photo', { required: true })} className="file-input" />
                    {errors.photo && <p className='text-red-500'>Photo is required.</p>}

                    <label className="label">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                    {errors.email && <p className='text-red-500'>Email is required.</p>}

                    <label className="label">Password</label>
                    <input type="password" {...register('password', {
                        required: true,
                        minLength: 6,
                        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
                    })} className="input" placeholder="Password" />
                    {errors.password && <p className='text-red-500'>Invalid password.</p>}

                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>
                <p>Already have an account? <Link state={location.state} className='text-blue-400 underline' to="/login">Login</Link></p>
            </form>
            <SocialLogin />
        </div>
    );
};

export default Register;
