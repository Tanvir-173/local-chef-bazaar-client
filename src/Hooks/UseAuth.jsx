// import { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../Context/AuthContext/AuthContext';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../Firebase/firebase.init';


// const UseAuth = () => {
//   const { signInUser, registerUser, logout } = useContext(AuthContext);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   return { user, loading, signInUser, registerUser, logout };
// };

// export default UseAuth;

// 222222222222222222222222
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext/AuthContext';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';

const UseAuth = () => {
  const { signInUser, registerUser, logout,updateUserProfile } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const provider = new GoogleAuthProvider();
  const signInGoogle = () => signInWithPopup(auth, provider);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading, signInUser, registerUser, logout, signInGoogle,updateUserProfile};
};

export default UseAuth;

// 3333333333333333333333333333333333
// import { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../Context/AuthContext/AuthContext';
// import { 
//   onAuthStateChanged, 
//   GoogleAuthProvider, 
//   signInWithPopup, 
//   fetchSignInMethodsForEmail, 
//   linkWithPopup 
// } from 'firebase/auth';
// import { auth } from '../Firebase/firebase.init';

// const UseAuth = () => {
//   const { signInUser, registerUser, logout, updateUserProfile } = useContext(AuthContext);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const signInGoogle = async () => {
//     const provider = new GoogleAuthProvider();

//     try {
//       const result = await signInWithPopup(auth, provider);
//       const googleUser = result.user;

//       // Check if email already exists with password
//       const methods = await fetchSignInMethodsForEmail(auth, googleUser.email);

//       if (methods.includes("password") && !methods.includes("google.com")) {
//         // User exists with email/password, link Google
//         // Ask user to sign in with email/password first
//         const password = prompt("Enter your password to link Google with your existing account:");
//         if (!password) return;

//         const emailPasswordSignIn = await signInUser(googleUser.email, password);

//         // Link Google provider to this account
//         await linkWithPopup(auth.currentUser, provider);

//         alert("Google account linked to your existing account!");
//         setUser(auth.currentUser);
//         return auth.currentUser;
//       }

//       // Otherwise, new Google user
//       setUser(googleUser);
//       return googleUser;

//     } catch (error) {
//       console.error("Google Login Error:", error.message);
//       throw error;
//     }
//   };

//   return { 
//     user, 
//     loading, 
//     signInUser, 
//     registerUser, 
//     logout, 
//     signInGoogle, 
//     updateUserProfile 
//   };
// };

// export default UseAuth;

