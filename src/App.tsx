import React, { useEffect } from 'react';
    import { onAuthStateChanged } from 'firebase/auth';
    import { doc, getDoc } from 'firebase/firestore';
    import { auth, db } from './config/firebase';
    import { useStore } from './store/useStore';
    import { Login } from './components/Login';
    import { Dashboard } from './components/Dashboard';
    import { User } from './types';
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import { LoanDetails } from './components/LoanDetails';

    function App() {
      const { user, setUser } = useStore();

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userRef = doc(db, 'users', firebaseUser.uid);
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
            <Route path="/" element={user ? <Dashboard /> : <Login />} />
            <Route path="/loan/:loanId" element={<LoanDetails />} />
          </Routes>
        </BrowserRouter>
      );
    }

    export default App;
