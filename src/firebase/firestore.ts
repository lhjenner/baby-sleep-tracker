import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from './config'

export const db = getFirestore(firebaseApp)

export type SleepStateData = {
  inProgress: boolean
  start: Timestamp | null
}

export type SleepCycleData = {
  start: Timestamp
  end: Timestamp | null
  durationMs: number | null
  date: string
  inProgress: boolean
}

const userDoc = (userId: string) => doc(db, 'users', userId)
const stateDoc = (userId: string) => doc(db, 'users', userId, 'sleepState', 'state')
const cyclesCollection = (userId: string) => collection(db, 'users', userId, 'sleepCycles')

export async function ensureUserDocuments(userId: string) {
  const stateReference = stateDoc(userId)
  const stateSnapshot = await getDoc(stateReference)
  await setDoc(userDoc(userId), {}, { merge: true })
  if (!stateSnapshot.exists()) {
    await setDoc(stateReference, { inProgress: false, start: null })
  }
}

export function subscribeToSleepState(userId: string, listener: (state: SleepStateData) => void): Unsubscribe {
  return onSnapshot(stateDoc(userId), (snapshot) => {
    const data = snapshot.data() as Partial<SleepStateData> | undefined
    listener({ inProgress: data?.inProgress ?? false, start: data?.start ?? null })
  })
}

export function subscribeToSleepCycles(userId: string, listener: (cycles: Array<SleepCycleData & { id: string }>) => void): Unsubscribe {
  const cyclesQuery = query(cyclesCollection(userId), orderBy('start', 'desc'))
  return onSnapshot(cyclesQuery, (snapshot) => {
    listener(snapshot.docs.map((cycle) => ({ id: cycle.id, ...(cycle.data() as SleepCycleData) })))
  })
}

export async function startSleep(userId: string, start: Timestamp, date: string) {
  await setDoc(stateDoc(userId), { inProgress: true, start })
  await addDoc(cyclesCollection(userId), { start, end: null, durationMs: null, date, inProgress: true })
}

export async function finishSleep(userId: string, cycleId: string, end: Timestamp, durationMs: number) {
  await setDoc(stateDoc(userId), { inProgress: false, start: null })
  await updateDoc(doc(cyclesCollection(userId), cycleId), { end, durationMs, inProgress: false })
}

export async function resetSleepState(userId: string) {
  await setDoc(stateDoc(userId), { inProgress: false, start: null })
}

export async function removeSleepCycle(userId: string, cycleId: string) {
  await deleteDoc(doc(cyclesCollection(userId), cycleId))
}

export async function updateSleepCycle(userId: string, cycleId: string, values: Pick<SleepCycleData, 'start' | 'end' | 'date' | 'durationMs'>) {
  await updateDoc(doc(cyclesCollection(userId), cycleId), { ...values, inProgress: false })
}

export async function findActiveSleep(userId: string) {
  const activeQuery = query(cyclesCollection(userId), where('inProgress', '==', true), limit(1))
  const snapshot = await getDoc(doc(db, 'users', userId, 'sleepState', 'state'))
  return { activeQuery, stateExists: snapshot.exists() }
}
