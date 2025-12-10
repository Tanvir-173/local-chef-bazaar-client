// import { AuthContext } from './AuthContext';
// import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from '../../Firebase/firebase.init';

// const AuthProvider = ({ children }) => {
//   const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
//   const signInUser = (email, password) => signInWithEmailAndPassword(auth, email, password);
//   const logout = () => signOut(auth);

//   const authInfo = { registerUser, signInUser, logout };

//   return (
//     <AuthContext.Provider value={authInfo}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
import { AuthContext } from './AuthContext';
import { 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth } from '../../Firebase/firebase.init';

const AuthProvider = ({ children }) => {

  // Register a new user
  const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  // Sign in existing user
  const signInUser = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // Sign out
  const logout = () => signOut(auth);

  // Update user profile (name, photo)
  const updateUserProfile = (profile) => {
    if (!auth.currentUser) return Promise.reject("No user is logged in");
    return updateProfile(auth.currentUser, profile);
  };

  const authInfo = { registerUser, signInUser, logout, updateUserProfile };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
