import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getUser } from '../utils/firebase.utils';

const Contact = () => {
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState(null);
  const [searchParams] = useSearchParams();

  const { landlordId } = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const landlord = await getUser(landlordId);
      setLandlord(landlord);
    };

    getLandlord();
  }, [landlordId]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>
      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord?.displayName}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={handleChange}
              ></textarea>
            </div>
          </form>
          <a
            href={`mailto:${landlord.email}?Subject=${searchParams.get(
              'listingName'
            )}&body=${message}`}
          >
            <button type="button" className="primaryButton">
              Send Message
            </button>
          </a>
        </main>
      )}
    </div>
  );
};

export default Contact;
