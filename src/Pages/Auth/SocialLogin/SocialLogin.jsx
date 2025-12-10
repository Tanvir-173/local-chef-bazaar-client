import React from 'react';
  // lowercase 'u'
import { useLocation, useNavigate } from 'react-router';
import UseAuth from '../../../Hooks/UseAuth';

const SocialLogin = () => {
    const { signInGoogle } = UseAuth();  // lowercase hook call
    const location = useLocation();
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        signInGoogle()
            .then(result => {
                console.log(result.user);
                navigate(location.state?.from || '/');
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div className='text-center pb-8'>
            <p className='mb-2'>OR</p>
            <button
                onClick={handleGoogleSignIn}
                className="btn bg-white text-black border-[#e5e5e5]">
                {/* Google SVG */}
                Login with Google
            </button>
        </div>
    );
};

export default SocialLogin;
