import { initializeApp } from 'firebase/app'

// Copy .env.example to .env.local and paste the Firebase web app values here via VITE_* variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'PASTE_FIREBASE_API_KEY_HERE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'PASTE_FIREBASE_AUTH_DOMAIN_HERE',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'PASTE_FIREBASE_PROJECT_ID_HERE',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'PASTE_FIREBASE_STORAGE_BUCKET_HERE',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? 'PASTE_FIREBASE_MESSAGING_SENDER_ID_HERE',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? 'PASTE_FIREBASE_APP_ID_HERE',
}

export const firebaseApp = initializeApp(firebaseConfig)
