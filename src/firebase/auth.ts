import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { firebaseApp } from './config'

export const auth = getAuth(firebaseApp)
export const authPersistence = setPersistence(auth, browserLocalPersistence)
export const subscribeToAuth = (listener: (user: User | null) => void) => onAuthStateChanged(auth, listener)
export const signIn = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)
export const createAccount = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password)
export const logOut = () => signOut(auth)
