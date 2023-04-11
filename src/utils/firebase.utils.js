import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { toast } from 'react-toastify';

const firebaseConfig = {
  apiKey: 'AIzaSyD17Zns_8cj2SGB1_r7qmWKtFiNxGXbCqc',
  authDomain: 'house-marketplace-app-b0e7f.firebaseapp.com',
  projectId: 'house-marketplace-app-b0e7f',
  storageBucket: 'house-marketplace-app-b0e7f.appspot.com',
  messagingSenderId: '246655924351',
  appId: '1:246655924351:web:58dfe9ae01fef66bc7a74a',
};

// Initialize Firebase
initializeApp(firebaseConfig);

//create authentication
export const auth = getAuth();

// Set up authentication provider
const googleProvider = new GoogleAuthProvider();

//Creating db
export const db = getFirestore();

export const getListings = async (categoryName) => {
  // Get reference
  const listingsRef = collection(db, 'listings');

  // Create a query
  const q = query(
    listingsRef,
    where('type', '==', categoryName),
    orderBy('timestamp', 'desc'),
    limit(10)
  );

  // Execute query
  const querySnap = await getDocs(q);

  const listings = [];

  querySnap.forEach((doc) => {
    return listings.push({ id: doc.id, data: doc.data() });
  });
  return listings;
};

export const createUserDocument = async (user, addititonalInfo = {}) => {
  if (!user) return;

  const userDocRef = doc(db, 'users', user.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = user;
    const created = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        created,
        ...addititonalInfo,
      });

      await updateProfile(auth.currentUser, {
        ...addititonalInfo,
      });
    } catch (error) {
      toast.error('Error creating the user');
    }
  }
  return userDocRef;
};

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => {
  onAuthStateChanged(auth, callback);
};

export const updateUserProfile = async ({ displayName }) => {
  return await updateProfile(auth.currentUser, { displayName });
};

export const updateUserDoc = async ({ displayName }) => {
  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  return await updateDoc(userDocRef, { displayName });
};

export const sendResetPasswordEmail = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};
