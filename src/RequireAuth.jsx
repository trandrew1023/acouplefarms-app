import { React } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useTokens from './tokenUtil';

/* eslint react/prop-types: 0 */
export default function RequireAuth({ children }) {
  const { loggedIn } = useTokens();
  const location = useLocation();

  return loggedIn ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}
