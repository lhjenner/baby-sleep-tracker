import { useState } from 'react'
import { LoginForm } from './components/LoginForm'
import { DatePicker } from './components/DatePicker'
import { SleepControls } from './components/SleepControls'
import { SleepList } from './components/SleepList'
import { Stopwatch } from './components/Stopwatch'
import { AuthProvider } from './context/AuthContext'
import { SleepProvider } from './context/SleepContext'
import { useAuth } from './hooks/useAuth'
import { useSleepCycles } from './hooks/useSleepCycles'
import { useSleepState } from './hooks/useSleepState'
import { getNzDateString } from './utils/nzTime'

function Tracker() {
  const { user, signOut } = useAuth()
  const { sleepState, startSleep, finishSleep } = useSleepState()
  const { cycles, deleteSleep, editSleep } = useSleepCycles()
  const [selectedDate, setSelectedDate] = useState(getNzDateString())
  const [busy, setBusy] = useState(false)

  async function run(action: () => Promise<void>) {
    setBusy(true)
    try { await action() } finally { setBusy(false) }
  }

  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#24302d]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b56c45]">Night notes</p><h1 className="mt-1 font-display text-3xl">Baby sleep tracker</h1></div><button className="text-sm font-semibold text-[#68716b] underline underline-offset-4" type="button" onClick={() => run(signOut)}>Sign out</button></header>
        <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
        <section className="space-y-3"><SleepControls inProgress={sleepState.inProgress} onStart={() => run(startSleep)} onFinish={() => run(finishSleep)} busy={busy} /><Stopwatch start={sleepState.inProgress ? sleepState.start : null} /></section>
        <SleepList cycles={cycles} selectedDate={selectedDate} onDelete={(cycle) => run(() => deleteSleep(cycle))} onEdit={(cycle, start, end) => run(() => editSleep(cycle, start, end))} />
        <p className="text-center text-xs text-[#8a9189]">{user?.email}</p>
      </div>
    </main>
  )
}

function AppContent() {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#f4f1e9] text-sm text-[#68716b]">Loading...</div>
  return user ? <SleepProvider><Tracker /></SleepProvider> : <LoginForm />
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>
}
