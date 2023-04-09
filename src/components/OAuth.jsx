import { useLocation, useNavigate } from 'react-router-dom';
import {
  signInWithGooglePopup,
  createUserDocument,
} from '../utils/firebase.utils';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithGooglePopup();
      await createUserDocument(user);

      navigate('/');
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') return;
      else toast.error('Could not authorize with Google.');
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with </p>
      <button className="socialIconDiv">
        <img
          className="socialIconImg"
          src={googleIcon}
          alt="google icon"
          onClick={signInWithGoogle}
        />
      </button>
    </div>
  );
};

export default OAuth;
