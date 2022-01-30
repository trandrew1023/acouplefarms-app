import { useState } from 'react';
import { getUser } from './service';

export default function useTokens() {
  const getTokensFromStorage = () => {
    const storageTokens = JSON.parse(localStorage.getItem('tokens'));
    return storageTokens;
  };

  const getUserFromStorage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  };

  const [tokens, setTokens] = useState(getTokensFromStorage());
  const [userDetails, setUserDetails] = useState(getUserFromStorage());

  const saveTokens = async (tokensToSave) => {
    if (!tokensToSave) {
      localStorage.removeItem('user');
      localStorage.removeItem('tokens');
      setUserDetails(null);
    } else {
      localStorage.setItem('tokens', JSON.stringify(tokensToSave));
      const userDetailsResponse = await getUser(tokensToSave);
      localStorage.setItem('user', JSON.stringify(userDetailsResponse));
      setUserDetails(userDetailsResponse);
    }
    setTokens(tokensToSave);
  };

  return {
    setTokens: saveTokens,
    tokens,
    userDetails,
  };
}
