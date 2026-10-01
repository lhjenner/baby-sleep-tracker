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
import type { BottleSubtype, EventType } from '../utils/eventTypes'

export const db = getFirestore(firebaseApp)

export type SleepStateData = {
  inProgress: boolean
  start: Timestamp | null
  cycleId?: string | null
}

export type SleepCycleData = {
  start: Timestamp
  end: Timestamp | null
  durationMs: number | null
  date: string
  inProgress: boolean
}

export type EventData = {
  type: EventType
  timestamp: Timestamp
  date: string
  subtype?: BottleSubtype
}

const userDoc = (userId: string) => doc(db, 'users', userId)
const stateDoc = (userId: string) => doc(db, 'users', userId, 'sleepState', 'state')
const cyclesCollection = (userId: string) => collection(db, 'users', userId, 'sleepCycles')
const eventsCollection = (userId: string) => collection(db, 'users', userId, 'events')

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
    listener({ inProgress: data?.inProgress ?? false, start: data?.start ?? null, cycleId: data?.cycleId ?? null })
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

export async function resumeSleep(userId: string, cycleId: string, start: Timestamp) {
  await setDoc(stateDoc(userId), { inProgress: true, start, cycleId })
  await updateDoc(doc(cyclesCollection(userId), cycleId), { end: null, durationMs: null, inProgress: true })
}

export async function resetSleepState(userId: string) {
  await setDoc(stateDoc(userId), { inProgress: false, start: null })
}

export async function removeSleepCycle(userId: string, cycleId: string) {
  await deleteDoc(doc(cyclesCollection(userId), cycleId))
}

export async function updateSleepCycle(userId: string, cycleId: string, values: Partial<SleepCycleData>) {
  await updateDoc(doc(cyclesCollection(userId), cycleId), values)
  if (values.inProgress && values.start) {
    await updateDoc(stateDoc(userId), { start: values.start })
  }
}

export async function findActiveSleep(userId: string) {
  const activeQuery = query(cyclesCollection(userId), where('inProgress', '==', true), limit(1))
  const snapshot = await getDoc(doc(db, 'users', userId, 'sleepState', 'state'))
  return { activeQuery, stateExists: snapshot.exists() }
}

export function subscribeToEvents(userId: string, listener: (events: Array<EventData & { id: string }>) => void): Unsubscribe {
  const eventsQuery = query(eventsCollection(userId), orderBy('timestamp', 'desc'))
  return onSnapshot(eventsQuery, (snapshot) => {
    listener(snapshot.docs.map((eventDoc) => ({ id: eventDoc.id, ...(eventDoc.data() as EventData) })))
  })
}

export async function addEvent(
  userId: string,
  type: EventType,
  timestamp: Timestamp,
  date: string,
  subtype?: BottleSubtype
) {
  const data: EventData = { type, timestamp, date }
  if (subtype !== undefined) {
    data.subtype = subtype
  }
  await addDoc(eventsCollection(userId), data)
}

export async function updateEvent(
  userId: string,
  eventId: string,
  timestamp: Timestamp,
  date: string,
  subtype?: BottleSubtype
) {
  const updateData: Partial<EventData> = { timestamp, date }
  if (subtype !== undefined) {
    updateData.subtype = subtype
  }
  await updateDoc(doc(eventsCollection(userId), eventId), updateData)
}

export async function removeEvent(userId: string, eventId: string) {
  await deleteDoc(doc(eventsCollection(userId), eventId))
}
