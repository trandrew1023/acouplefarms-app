import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';
import EditOrganization from './components/EditOrganization';
import ForgotPassword from './components/ForgotPassword';
import Header from './components/Header';
import Home from './components/Home';
import Locations from './components/Locations';
import Login from './components/Login';
import NewOrganization from './components/NewOrganization';
import Organizations from './components/Organizations';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import SignUp from './components/SignUp';
import useAuth from './tokenUtil';
import StatLineChart from './components/StatLineChart';
import NavigateSetter from './components/NavigateSetter';
import RequireAuth from './RequireAuth';

function App() {
  const { setTokens, loggedIn } = useAuth();
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const storageRef = ref(storage);
  const profileImagesRef = ref(storageRef, 'images/profile');

  return (
    <Router>
      <>
        <NavigateSetter />
        <Header
          loggedIn={loggedIn}
          setTokens={setTokens}
        />
        <Routes>
          <Route
            path="/login"
            element={loggedIn ? <Organizations /> : <Login setTokens={setTokens} />}
          />
          <Route
            path="/register"
            element={loggedIn ? <Organizations /> : <SignUp />}
          />
          <Route
            path="/forgot-password"
            element={loggedIn ? <Organizations /> : <ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={loggedIn ? <Organizations /> : <ResetPassword />}
          />
          <Route
            path="/profile"
            element={(
              <RequireAuth>
                <Profile
                  profileImagesRef={profileImagesRef}
                />
              </RequireAuth>
            )}
          />
          <Route
            path="/edit-organization"
            element={(
              <RequireAuth>
                <EditOrganization />
              </RequireAuth>
            )}
          />
          <Route
            path="/new-organization"
            element={(
              <RequireAuth>
                <NewOrganization />
              </RequireAuth>
            )}
          />
          <Route
            path="/organizations"
            element={(
              <RequireAuth>
                <Organizations />
              </RequireAuth>
            )}
          />
          <Route
            path="/line-chart"
            element={(
              <RequireAuth>
                <StatLineChart />
              </RequireAuth>
            )}
          />
          <Route
            path="/locations"
            element={(
              <RequireAuth>
                <Locations />
              </RequireAuth>
            )}
          />
          <Route
            path="/"
            element={loggedIn ? <Organizations /> : <Home />}
          />
          <Route
            path="*"
            element={<RequireAuth><Organizations /></RequireAuth>}
          />
        </Routes>
      </>
    </Router>
  );
}

export default App;
