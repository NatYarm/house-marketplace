import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import {
  signOutUser,
  updateUserProfile,
  updateUserDoc,
} from '../utils/firebase.utils';
import { toast } from 'react-toastify';

const Profile = () => {
  const { currentUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    displayName: currentUser.displayName,
    email: currentUser.email,
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
      if (currentUser.displayName !== displayName) {
        //Update display name in firebase
        await updateUserProfile({ displayName });

        //Update in firestore
        await updateUserDoc({ displayName });
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
