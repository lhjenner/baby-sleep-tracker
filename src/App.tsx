import { useState } from 'react'
import { LoginForm } from './components/LoginForm'
import { DatePicker } from './components/DatePicker'
import { EventButtons } from './components/EventButtons'
import { SleepControls } from './components/SleepControls'
import { SleepList } from './components/SleepList'
import { Stopwatch } from './components/Stopwatch'
import { ThemeToggle } from './components/ThemeToggle'
import { AuthProvider } from './context/AuthContext'
import { EventsProvider } from './context/EventsContext'
import { SleepProvider } from './context/SleepContext'
import { useAuth } from './hooks/useAuth'
import { useEvents } from './hooks/useEvents'
import { useSleepCycles } from './hooks/useSleepCycles'
import { useSleepState } from './hooks/useSleepState'
import { getNzDateString } from './utils/nzTime'

function Tracker() {
  const { user, signOut } = useAuth()
  const { sleepState, startSleep, finishSleep } = useSleepState()
  const { cycles, deleteSleep, editSleep } = useSleepCycles()
  const { events, createEvent, editEvent, deleteEvent } = useEvents()
  const [selectedDate, setSelectedDate] = useState(getNzDateString())
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function run(action: () => Promise<void>) {
    setBusy(true)
    setActionError(null)
    try {
      await action()
    } catch (error) {
      // surface failures instead of letting them fail silently as unhandled rejections
      console.error(error)
      setActionError(error instanceof Error ? error.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#24302d] dark:bg-[#1b2422] dark:text-[#eef1ee]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b56c45]">Night notes</p><h1 className="mt-1 font-display text-3xl">Baby sleep tracker</h1></div><div className="flex items-center gap-3"><ThemeToggle /><button className="text-sm font-semibold text-[#68716b] underline underline-offset-4 dark:text-[#9aa89f]" type="button" onClick={() => run(signOut)}>Sign out</button></div></header>
        <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
        <section className="space-y-3">
          <SleepControls inProgress={sleepState.inProgress} onStart={() => run(startSleep)} onFinish={() => run(finishSleep)} busy={busy} />
          <EventButtons onCreate={(type) => run(() => createEvent(type))} busy={busy} />
          {actionError && <p className="text-sm font-semibold text-[#913f2b] dark:text-[#f0a58e]" role="alert">{actionError}</p>}
          <Stopwatch start={sleepState.inProgress ? sleepState.start : null} />
        </section>
        <SleepList
          cycles={cycles}
          events={events}
          selectedDate={selectedDate}
          onDelete={(cycle) => run(() => deleteSleep(cycle))}
          onEdit={(cycle, start, end) => run(() => editSleep(cycle, start, end))}
          onDeleteEvent={(event) => run(() => deleteEvent(event))}
          onEditEvent={(event, timestamp, subtype) => run(() => editEvent(event, timestamp, subtype))}
        />
        <p className="text-center text-xs text-[#8a9189]">{user?.email}</p>
      </div>
    </main>
  )
}

function AppContent() {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#f4f1e9] text-sm text-[#68716b] dark:bg-[#1b2422] dark:text-[#9aa89f]">Loading...</div>
  return user ? <SleepProvider><EventsProvider><Tracker /></EventsProvider></SleepProvider> : <LoginForm />
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>
}
