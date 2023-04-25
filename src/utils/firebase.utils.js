import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
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
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
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

// Get collection reference
const listingsRef = collection(db, 'listings');

const updateListings = (querySnap) => {
  //Get last visible doc
  lastVisible = querySnap.docs[querySnap.docs.length - 1];

  const listings = [];

  querySnap.forEach((doc) => {
    return listings.push({ id: doc.id, data: doc.data() });
  });
  return listings;
};

export let lastVisible = null;

export const getListings = async (fieldName, fieldValue, pageSize = 2) => {
  // Create a query
  const queryConstraints = [];
  if (fieldName !== null) {
    queryConstraints.push(where(fieldName, '==', fieldValue));
  }
  if (fieldValue !== null) {
    queryConstraints.push(where(fieldName, '==', fieldValue));
  }

  const q = query(
    listingsRef,
    orderBy('timestamp', 'desc'),
    limit(pageSize),
    ...queryConstraints
  );

  // Execute query
  const querySnap = await getDocs(q);

  const listings = updateListings(querySnap);

  return listings;
};

export const getMoreListings = async (fieldName, fieldValue, pageSize = 2) => {
  const queryConstraints = [];
  if (fieldName !== null) {
    queryConstraints.push(where(fieldName, '==', fieldValue));
  }
  if (fieldValue !== null) {
    queryConstraints.push(where(fieldName, '==', fieldValue));
  }

  const q = query(
    listingsRef,
    orderBy('timestamp', 'desc'),
    startAfter(lastVisible),
    limit(pageSize),
    ...queryConstraints
  );

  const querySnap = await getDocs(q);
  const listings = updateListings(querySnap);

  return listings;
};

export const getListing = async (listingId) => {
  const docRef = doc(db, 'listings', listingId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const listing = docSnap.data();
    return listing;
  } else {
    toast.error('Listing does not exitst');
  }
};

export const getUser = async (userId) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const user = docSnap.data();
    return user;
  } else {
    toast.error('Could not get landlord data');
  }
};

export const createUserDocument = async (user, addititonalInfo = {}) => {
  if (!user) return;

  const userDocRef = doc(db, 'users', user.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = user;
    const timestamp = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        timestamp,
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

export const addDocsToCollection = async (collectionName, objectToAdd) => {
  return await addDoc(collection(db, collectionName), objectToAdd);
};

export const updateUserProfile = async ({ displayName }) => {
  return await updateProfile(auth.currentUser, { displayName });
};

export const updateUserDoc = async ({ displayName }) => {
  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  return await updateDoc(userDocRef, { displayName });
};

export const updateListing = async (listingId, updatedListing) => {
  return await updateDoc(doc(db, 'listings', listingId), updatedListing);
};

export const deleteListing = async (listingId) => {
  const docRef = doc(db, 'listings', listingId);
  return await deleteDoc(docRef, listingId);
};

export const sendResetPasswordEmail = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

export const storeImage = async (image) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
    const storageRef = ref(storage, 'images/' + fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
