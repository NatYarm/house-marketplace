import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getListing } from '../utils/firebase.utils';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const { listingId } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const listing = await getListing(listingId);
      setListing(listing);
      setLoading(false);
    };

    fetchListing();
  }, [listingId, navigate]);

  console.log(listing);

  return <div>Listing</div>;
};

export default Listing;
