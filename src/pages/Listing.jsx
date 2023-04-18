import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { getListing } from '../utils/firebase.utils';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import UserContext from '../context/UserContext';

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const { listingId } = useParams();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchListing = async () => {
      const selectedListing = await getListing(listingId);
      setListing(selectedListing);
      setLoading(false);
    };

    fetchListing();
  }, [listingId, navigate]);

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    setTimeout(() => {
      setShareLinkCopied(false);
    }, 2000);
  };

  if (loading) {
    return <Spinner />;
  }

  const {
    name,
    offer,
    discountedPrice,
    regularPrice,
    location,
    type,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    userRef,
    geolocation,
  } = listing;

  return (
    <main>
      {/* Slider */}
      <div className="shareIconDiv" onClick={handleClick}>
        <img src={shareIcon} alt="share icon" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link copied</p>}
      <div className="listingDetails">
        <p className="listingName">
          {name} - $
          {offer
            ? discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className="listingLocation">{location}</p>
        <p className="listingType">For {type === 'rent' ? 'Rent' : 'Sale'}</p>
        {offer && (
          <p className="discountPrice">
            ${regularPrice - discountedPrice} discount
          </p>
        )}

        <ul className="listingDetailsList">
          <li>{bedrooms > 1 ? `${bedrooms} Bedrooms` : '1 Bedroom'}</li>
          <li>{bathrooms > 1 ? `${bathrooms} Bathrooms` : '1 Bathroom'}</li>
          <li>{parking && 'Parking Spot'}</li>
          <li>{furnished && 'Furnished'}</li>
        </ul>
        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[geolocation.lat, geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
            />
            <Marker position={[geolocation.lat, geolocation.lng]}>
              <Popup>{location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {currentUser?.uid !== userRef && (
          <Link
            to={`/contact/${userRef}?listingName=${name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
