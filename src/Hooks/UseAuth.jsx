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
