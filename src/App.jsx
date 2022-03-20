import './App.css';
import { React, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';
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
import Settings from './components/Settings';

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
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('dark-mode-pref') === null ? 'light' : localStorage.getItem('dark-mode-pref'),
  );
  const theme = createTheme({
    palette: {
      mode: darkMode,
      primary: {
        main: darkMode === 'dark' ? grey[800] : grey[300],
        button: darkMode === 'dark' ? grey[700] : blue[700],
      },
      secondary: {
        main: darkMode === 'dark' ? grey[800] : grey[300],
        menu: darkMode === 'dark' ? grey[900] : grey[100],
      },
    },
  });

  const toggleDarkMode = (mode) => {
    setDarkMode(mode);
    localStorage.setItem('dark-mode-pref', mode);
  };

  return (
    <ThemeProvider theme={theme}>
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
              path="/settings"
              element={(
                <RequireAuth>
                  <Settings
                    darkMode={darkMode}
                    setDarkMode={toggleDarkMode}
                  />
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
    </ThemeProvider>
  );
}

export default App;
