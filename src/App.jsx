import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import useTokens from './tokenUtil';
import StatLineChart from './components/StatLineChart';
import NavigateSetter from './components/NavigateSetter';

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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </>
      </Router>
    );
  }

  return (
    <Router>
      <>
        <NavigateSetter />
        <Header
          isLoggedIn
          setTokens={setTokens}
          userDetails={userDetails}
        />
        <Routes>
          <Route path="/login" element={localStorage.getItem('tokens') ? <Login setTokens={setTokens} /> : <Organizations />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-organization" element={<EditOrganization />} />
          <Route path="/new-organization" element={<NewOrganization />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/line-chart" element={<StatLineChart />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/" element={<Organizations />} />
          <Route path="*" element={<Organizations />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
