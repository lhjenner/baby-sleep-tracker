import { useContext } from 'react'
import { EventsContext } from '../context/EventsContext'

export function useEvents() {
  const { events, createEvent, editEvent, deleteEvent } = useContext(EventsContext)
  return { events, createEvent, editEvent, deleteEvent }
}
