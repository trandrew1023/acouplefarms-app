import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EditOrganization from './components/EditOrganization';
import Home from './components/Home';
import Header from './components/Header';
import Locations from './components/Locations';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import useTokens from './tokenUtil';
import Organizations from './components/Organizations';
import NewOrganization from './components/NewOrganization';

function App() {
  const { tokens, setTokens, userDetails } = useTokens();

  if (!tokens) {
    return (
      <Router>
        <>
          <Header
            setTokens={setTokens}
            userDetails={userDetails}
          />
          <Routes>
            <Route path="/login" element={<Login setTokens={setTokens} />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </>
      </Router>
    );
  }

  return (
    <Router>
      <>
        <Header
          isLoggedIn
          setTokens={setTokens}
          userDetails={userDetails}
        />
        <Routes>
          <Route path="/edit-organization" element={<EditOrganization />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/new-organization" element={<NewOrganization />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/profile" element={<Profile userDetails={userDetails} />} />
          <Route path="/" element={<Organizations />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
