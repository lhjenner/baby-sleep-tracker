import { createContext, useEffect, useState, type ReactNode } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth'
import {
  addEvent as addEventInFirestore,
  removeEvent as removeEventInFirestore,
  subscribeToEvents,
  updateEvent as updateEventInFirestore,
  type EventData,
} from '../firebase/firestore'
import type { BottleSubtype, EventType } from '../utils/eventTypes'
import { getNzDateString } from '../utils/nzTime'

export type BabyEvent = EventData & { id: string }

type EventsContextValue = {
  events: BabyEvent[]
  createEvent: (type: EventType) => Promise<void>
  editEvent: (event: BabyEvent, timestamp: Timestamp, subtype?: BottleSubtype) => Promise<void>
  deleteEvent: (event: BabyEvent) => Promise<void>
}

export const EventsContext = createContext<EventsContextValue>({
  events: [],
  createEvent: async () => undefined,
  editEvent: async () => undefined,
  deleteEvent: async () => undefined,
})

export function EventsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [events, setEvents] = useState<BabyEvent[]>([])

  useEffect(() => {
    if (!user) {
      setEvents([])
      return undefined
    }
    return subscribeToEvents(user.uid, setEvents)
  }, [user])

  async function createEvent(type: EventType) {
    if (!user) return
    const timestamp = Timestamp.now()
    const subtype = type === 'bottle' ? ('formula' as const) : undefined
    await addEventInFirestore(user.uid, type, timestamp, getNzDateString(timestamp.toDate()), subtype)
  }

  async function editEvent(event: BabyEvent, timestamp: Timestamp, subtype?: BottleSubtype) {
    if (!user) return
    const nextSubtype = subtype ?? (event.type === 'bottle' ? (event.subtype ?? 'formula') : undefined)
    await updateEventInFirestore(user.uid, event.id, timestamp, getNzDateString(timestamp.toDate()), nextSubtype)
  }

  async function deleteEvent(event: BabyEvent) {
    if (!user) return
    await removeEventInFirestore(user.uid, event.id)
  }

  return <EventsContext.Provider value={{ events, createEvent, editEvent, deleteEvent }}>{children}</EventsContext.Provider>
}
