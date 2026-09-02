import { useContext } from 'react'
import { SleepContext } from '../context/SleepContext'

export function useSleepCycles() {
  const { cycles, deleteSleep, editSleep } = useContext(SleepContext)
  return { cycles, deleteSleep, editSleep }
}
