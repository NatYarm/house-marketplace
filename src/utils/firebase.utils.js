import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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

export const db = getFirestore();

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
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }
  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

// In the Suin-up component

// try {
//   const { user } = await createAuthUserWithEmailAndPassword(
//     email,
//     password
//   );
//   await createUserDocument(user, { displayName: name });
// } catch (error) {

// }
