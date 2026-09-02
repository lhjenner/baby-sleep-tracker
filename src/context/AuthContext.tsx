import { createContext, useEffect, useState, type ReactNode } from 'react'
import { type User } from 'firebase/auth'
import { authPersistence, createAccount, logOut, signIn, subscribeToAuth } from '../firebase/auth'
import { ensureUserDocuments } from '../firebase/firestore'

export type AuthContextValue = {
  user: User | null
  loading: boolean
  error: string | null
  signInWithEmail: (email: string, password: string) => Promise<void>
  createEmailAccount: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null,
  signInWithEmail: async () => undefined,
  createEmailAccount: async () => undefined,
  signOut: async () => undefined,
  clearError: () => undefined,
})

function messageForAuthError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message.replace('Firebase: ', '').replace(/ \(auth\/[^)]+\)/, '')
  return 'Unable to complete that request.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) = () => undefined
    authPersistence
      .then(() => {
        if (!active) return
        unsubscribe = subscribeToAuth(async (nextUser) => {
          if (nextUser) await ensureUserDocuments(nextUser.uid)
          if (active) {
            setUser(nextUser)
            setLoading(false)
          }
        })
      })
      .catch((authError: unknown) => {
        if (active) {
          setError(messageForAuthError(authError))
          setLoading(false)
        }
      })
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  async function runAuthAction(action: () => Promise<void>) {
    setError(null)
    try {
      await action()
    } catch (authError) {
      setError(messageForAuthError(authError))
      throw authError
    }
  }

  const value: AuthContextValue = {
    user,
    loading,
    error,
    signInWithEmail: (email, password) => runAuthAction(async () => { await signIn(email, password) }),
    createEmailAccount: (email, password) => runAuthAction(async () => { await createAccount(email, password) }),
    signOut: () => runAuthAction(async () => { await logOut() }),
    clearError: () => setError(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
