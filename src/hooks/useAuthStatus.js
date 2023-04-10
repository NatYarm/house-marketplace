import { useState } from 'react';
import { onAuthStateChangedListener } from '../utils/firebase.utils';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  onAuthStateChangedListener((user) => {
    if (user) {
      setLoggedIn(true);
    }
    setCheckingStatus(false);
  });

  return { loggedIn, checkingStatus };
};
