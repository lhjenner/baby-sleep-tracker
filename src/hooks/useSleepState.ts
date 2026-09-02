import { useContext } from 'react'
import { SleepContext } from '../context/SleepContext'

export function useSleepState() {
  const { sleepState, startSleep, finishSleep, resetSleepState } = useContext(SleepContext)
  return { sleepState, startSleep, finishSleep, resetSleepState }
}
