import { createContext, useEffect, useState, type ReactNode } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth'
import {
  finishSleep as finishSleepInFirestore,
  removeSleepCycle,
  resetSleepState as resetStateInFirestore,
  startSleep as startSleepInFirestore,
  subscribeToSleepCycles,
  subscribeToSleepState,
  updateSleepCycle,
  type SleepCycleData,
  type SleepStateData,
} from '../firebase/firestore'
import { getNzDateString } from '../utils/nzTime'

export type SleepCycle = SleepCycleData & { id: string }

type SleepContextValue = {
  sleepState: SleepStateData
  cycles: SleepCycle[]
  startSleep: () => Promise<void>
  finishSleep: () => Promise<void>
  resetSleepState: () => Promise<void>
  deleteSleep: (cycle: SleepCycle) => Promise<void>
  editSleep: (cycle: SleepCycle, start: Timestamp, end: Timestamp) => Promise<void>
}

export const SleepContext = createContext<SleepContextValue>({
  sleepState: { inProgress: false, start: null },
  cycles: [],
  startSleep: async () => undefined,
  finishSleep: async () => undefined,
  resetSleepState: async () => undefined,
  deleteSleep: async () => undefined,
  editSleep: async () => undefined,
})

export function SleepProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [sleepState, setSleepState] = useState<SleepStateData>({ inProgress: false, start: null })
  const [cycles, setCycles] = useState<SleepCycle[]>([])

  useEffect(() => {
    if (!user) {
      setSleepState({ inProgress: false, start: null })
      setCycles([])
      return undefined
    }
    const unsubscribeState = subscribeToSleepState(user.uid, setSleepState)
    const unsubscribeCycles = subscribeToSleepCycles(user.uid, setCycles)
    return () => {
      unsubscribeState()
      unsubscribeCycles()
    }
  }, [user])

  async function startSleep() {
    if (!user || sleepState.inProgress) return
    await startSleepInFirestore(user.uid, Timestamp.now(), getNzDateString())
  }

  async function finishSleep() {
    const activeCycle = cycles.find((cycle) => cycle.inProgress)
    if (!user || !sleepState.start || !activeCycle) return
    const end = Timestamp.now()
    await finishSleepInFirestore(user.uid, activeCycle.id, end, end.toMillis() - sleepState.start.toMillis())
  }

  async function resetSleepState() {
    if (user) await resetStateInFirestore(user.uid)
  }

  async function deleteSleep(cycle: SleepCycle) {
    if (!user) return
    await removeSleepCycle(user.uid, cycle.id)
    if (cycle.inProgress) await resetStateInFirestore(user.uid)
  }

  async function editSleep(cycle: SleepCycle, start: Timestamp, end: Timestamp) {
    if (!user || end.toMillis() < start.toMillis()) return
    await updateSleepCycle(user.uid, cycle.id, {
      start,
      end,
      date: getNzDateString(start.toDate()),
      durationMs: end.toMillis() - start.toMillis(),
    })
  }

  return <SleepContext.Provider value={{ sleepState, cycles, startSleep, finishSleep, resetSleepState, deleteSleep, editSleep }}>{children}</SleepContext.Provider>
}
