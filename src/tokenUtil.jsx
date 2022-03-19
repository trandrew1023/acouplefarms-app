import {
  React,
  createContext,
  useContext,
  useState,
} from 'react';

const authContext = createContext();

function useAuth() {
  const getTokensFromStorage = () => {
    const storageTokens = JSON.parse(localStorage.getItem('tokens'));
    return storageTokens;
  };

  const [loggedIn, setLoggedIn] = useState(getTokensFromStorage() !== null);

  const saveTokens = async (tokensToSave) => {
    if (!tokensToSave) {
      localStorage.removeItem('tokens');
      setLoggedIn(false);
    } else {
      localStorage.setItem('tokens', JSON.stringify(tokensToSave));
      setLoggedIn(true);
    }
  };

  return {
    setTokens: saveTokens,
    loggedIn,
  };
}

/* eslint react/prop-types: 0 */
export function AuthProvider({ children }) {
  const auth = useAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return useContext(authContext);
}
