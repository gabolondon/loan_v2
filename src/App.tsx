import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config/firebase";
import { useStore } from "./store/useStore";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { User } from "./types";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoanDetails } from "./components/LoanDetails";
import { LoanList } from "./components/LoanList";
import { Home } from "./components/Home";
import { UserManagement } from "./components/UserManagement";

function App() {
  const { user, setUser } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Login />}>
          <Route index element={<Home />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="loans" element={<LoanList />} />
          <Route path="loan/:loanId" element={<LoanDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
