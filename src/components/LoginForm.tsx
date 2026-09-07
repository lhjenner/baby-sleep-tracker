import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export function LoginForm() {
  const { signInWithEmail, createEmailAccount, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    clearError()
    setBusy(true)
    try {
      if (creating) await createEmailAccount(email, password)
      else await signInWithEmail(email, password)
    } catch {
      // The context exposes the Firebase error beside the form.
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f1e9] px-5 py-10 text-[#24302d] dark:bg-[#1b2422] dark:text-[#eef1ee]">
      <section className="w-full max-w-md rounded-[2rem] border border-[#d8d2c4] bg-[#fffdf8] p-7 shadow-[0_20px_60px_rgba(53,64,58,0.12)] dark:border-[#3a4a45] dark:bg-[#233029] sm:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b56c45]">Night notes</p>
        <h1 className="font-display text-4xl leading-tight">Baby sleep tracker</h1>
        <p className="mt-3 text-[#68716b] dark:text-[#9aa89f]">A quiet place to keep track of the little hours.</p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold">
            Email
            <input className="field mt-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input className="field mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} autoComplete={creating ? 'new-password' : 'current-password'} />
          </label>
          {error && <p className="rounded-xl bg-[#f9e3dc] px-4 py-3 text-sm text-[#913f2b] dark:bg-[#3a2420] dark:text-[#f0a58e]" role="alert">{error}</p>}
          <button className="button-primary w-full" disabled={busy} type="submit">{busy ? 'Please wait...' : creating ? 'Create account' : 'Sign in'}</button>
        </form>
        <button className="mt-5 w-full text-sm font-semibold text-[#b56c45] underline decoration-[#e4b29b] underline-offset-4 dark:text-[#e4a37c] dark:decoration-[#8a5b3f]" type="button" onClick={() => { setCreating(!creating); clearError() }}>
          {creating ? 'Already have an account? Sign in' : 'New here? Create an account'}
        </button>
      </section>
    </main>
  )
}
