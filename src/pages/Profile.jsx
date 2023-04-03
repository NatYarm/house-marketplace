import { useState, useEffect } from 'react';
import { auth } from '../firebase.config';

const Profile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(auth.currentUser);
  }, []);
  return user ? <h1>{user.displayName}</h1> : 'Not logged in';
};

export default Profile;
