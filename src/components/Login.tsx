import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useStore } from '../store/useStore';
import { User } from "../types";

const ADMIN_EMAIL = "ing.gabriel.londono@gmail.com"; // Configure this

export const Login: React.FC = () => {
  const setUser = useStore((state) => state.setUser);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user: firebaseUser } = result;

      const userRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName!,
        photoURL: firebaseUser.photoURL!,
        isAdmin: firebaseUser.email === ADMIN_EMAIL,
        createdAt: userDoc.exists()
          ? userDoc.data().createdAt
          : new Date().toISOString(),
      };

      if (!userDoc.exists()) {
        await setDoc(userRef, userData);
      }

      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
          <p className="mt-2 text-gray-600">
            Sign in to access your loan dashboard
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <img
              className="w-5 h-5 mr-2"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};
