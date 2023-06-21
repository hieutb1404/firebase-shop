import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: 'shopping-hshop.firebaseapp.com',
  projectId: 'shopping-hshop',
  storageBucket: 'shopping-hshop.appspot.com',
  messagingSenderId: '597982316098',
  appId: '1:597982316098:web:61f42c3885d1bf85130fdb',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//auth là biến xác minh account
// tất cả các func get này đều nhận từ trên firebase xuống đây để code
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
