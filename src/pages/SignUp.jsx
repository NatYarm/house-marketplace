import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createAuthUserWithEmailAndPassword,
  createUserDocument,
} from '../utils/firebase.utils';
import OAuth from '../components/OAuth';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

const defaultFormData = {
  displayName: '',
  email: '',
  password: '',
};

const SignUp = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [showPassword, setShowPassword] = useState(false);
  const { displayName, email, password } = formData;

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocument(user, { displayName });

      navigate('/profile');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error('Cannot create user, email already in use');
          break;
        case 'auth/weak-password':
          toast.error('Weak password');
          break;
        default:
          toast.error('Something went wrong with registration');
      }
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <main>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="nameInput"
              placeholder="Name"
              id="displayName"
              value={displayName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={handleChange}
              required
            />
            <div className="passwordInputDiv">
              <input
                type={showPassword ? 'text' : 'password'}
                className="passwordInput"
                placeholder="Password"
                id="password"
                value={password}
                onChange={handleChange}
                required
              />
              <img
                src={visibilityIcon}
                alt=""
                className="showPassword"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>

            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>
            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signInButton">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </form>

          <OAuth />

          <div className="loginContainer">
            <div className="loginText">Already have an account?</div>
            <Link to="/sign-in" className="registerLink">
              Sign In
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default SignUp;
