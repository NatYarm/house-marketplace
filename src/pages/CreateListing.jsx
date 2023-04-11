import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Spinner from '../components/Spinner';

const defaultFormData = {
  type: 'rent',
  name: '',
  bedrooms: 1,
  bathrooms: 1,
  parking: false,
  furnished: false,
  address: '',
  offer: false,
  regularPrice: 0,
  discountedPrice: 0,
  images: {},
  latitude: 0,
  longitude: 0,
};

const CreateListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setFormData({ ...formData, userRef: currentUser.uid });
    } else {
      navigate('/sign-in');
    }
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return <div>CreateListing</div>;
};

export default CreateListing;
