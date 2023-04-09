import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase.config';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { signOutUser } from '../utils/firebase.utils';
import { toast } from 'react-toastify';

const Profile = () => {
  const [formData, setFormData] = useState({
    displayName: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [changeDetails, setChangeDetails] = useState(false);

  const { displayName, email } = formData;

  const navigate = useNavigate();

  const handleLogout = () => {
    signOutUser();
    navigate('/');
  };

  const handleSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== displayName) {
        //Update display name in firebase
        await updateProfile(auth.currentUser, { displayName });

        //Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { displayName });
      }
    } catch (error) {
      toast.error('Could not update profile details.');
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && handleSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="displayName"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={displayName}
              onChange={handleChange}
            />
            <input
              type="email"
              id="email"
              className="profileEmail"
              disabled={!changeDetails}
              value={email}
              onChange={handleChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
