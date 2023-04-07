import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD17Zns_8cj2SGB1_r7qmWKtFiNxGXbCqc',
  authDomain: 'house-marketplace-app-b0e7f.firebaseapp.com',
  projectId: 'house-marketplace-app-b0e7f',
  storageBucket: 'house-marketplace-app-b0e7f.appspot.com',
  messagingSenderId: '246655924351',
  appId: '1:246655924351:web:58dfe9ae01fef66bc7a74a',
};

initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
