import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../Firebase/firebase.init';

const AuthProvider = ({ children }) => {
  const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const signInUser = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const authInfo = { registerUser, signInUser, logout };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
