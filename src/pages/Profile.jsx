import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import {
  signOutUser,
  updateUserProfile,
  updateUserDoc,
  getListings,
  deleteListing,
} from '../utils/firebase.utils';
import ListingItem from '../components/ListingItem';
import { toast } from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

const Profile = () => {
  const { currentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    displayName: currentUser.displayName,
    email: currentUser.email,
  });
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const { displayName, email } = formData;
  const [changeDetails, setChangeDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const userListings = await getListings('userRef', currentUser.uid, 10);
      setListings(userListings);
      setLoading(false);
    };

    fetchUserListings();
  }, [currentUser.uid]);

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

  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete the listing?')) {
      await deleteListing(listingId);
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success('Listing deleted');
    }
  };

  const handleEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

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
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => handleDelete(listing.id)}
                  onEdit={() => handleEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
