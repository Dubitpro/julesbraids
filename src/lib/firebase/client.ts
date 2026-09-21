import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDj_KtVPBmEUcbeEr2Jv6Y60_uKIQplRuY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tayois50.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tayois50",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tayois50.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "954697248213",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:954697248213:web:8fd974cec9d739eddf615c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-E0678DQVG6",
};

// Initialize Firebase App as a singleton
export const app: FirebaseApp = getApps().length > 0 
  ? getApp() 
  : initializeApp(firebaseConfig);

// Initialize Auth
export const auth: Auth = getAuth(app);

// Lazy accessor for Firestore to prevent massive bundles (re2js/bloom/webchannel) in layout chunk
let firestoreInstance: any = null;
export async function getDb() {
  if (!firestoreInstance) {
    const { getFirestore } = await import("firebase/firestore");
    firestoreInstance = getFirestore(app);
  }
  return firestoreInstance;
}
