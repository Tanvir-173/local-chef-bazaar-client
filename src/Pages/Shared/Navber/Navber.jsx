import React, { useEffect, useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../Firebase/firebase.init';
import { AuthContext } from '../../../Context/AuthContext/AuthContext';

const Navber = () => {
  const [userData, setUserData] = useState(null);
  const { logout } = useContext(AuthContext); // get logout function
  const navigate = useNavigate();

  // Monitor user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUserData(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-xl">LocalChefBazaar</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-yellow-400 font-semibold' : 'hover:text-yellow-400'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/meals"
            className={({ isActive }) =>
              isActive ? 'text-yellow-400 font-semibold' : 'hover:text-yellow-400'
            }
          >
            Meals
          </NavLink>
          {userData && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-400 font-semibold' : 'hover:text-yellow-400'
                }
              >
                Dashboard
              </NavLink>
              {/* <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-400 font-semibold' : 'hover:text-yellow-400'
                }
              >
                Profile
              </NavLink> */}
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {!userData ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded hover:bg-yellow-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-600 hover:text-white transition"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <img
                src={userData.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png'}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-yellow-500 cursor-pointer"
                title="Go to Profile"
                onClick={() => navigate('/profile')}
              />
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navber;
