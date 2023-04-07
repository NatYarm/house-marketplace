import { useState } from 'react';
import { auth } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const [formData, setFormData] = useState({
    displayName: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { displayName, email } = formData;

  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={handleLogout}>
          Logout
        </button>
      </header>
    </div>
  );
};

export default Profile;
