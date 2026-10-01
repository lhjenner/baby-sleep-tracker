import type { Timestamp } from 'firebase/firestore'
import type { SleepCycle } from '../context/SleepContext'
import type { BabyEvent } from '../context/EventsContext'
import type { BottleSubtype } from '../utils/eventTypes'
import { resumeSleep } from '../firebase/firestore'
import { useAuth } from '../hooks/useAuth'
import { useSleepState } from '../hooks/useSleepState'
import { SleepEntry } from './SleepEntry'
import { EventEntry } from './EventEntry'

type SleepListProps = {
  cycles: SleepCycle[]
  events: BabyEvent[]
  selectedDate: string
  onDelete: (cycle: SleepCycle) => Promise<void>
  onEdit: (cycle: SleepCycle, start: Timestamp, end: Timestamp | null) => Promise<void>
  onDeleteEvent: (event: BabyEvent) => Promise<void>
  onEditEvent: (event: BabyEvent, timestamp: Timestamp, subtype?: BottleSubtype) => Promise<void>
}

type DailyItem = { kind: 'sleep'; time: number; cycle: SleepCycle } | { kind: 'event'; time: number; event: BabyEvent }

export function SleepList({ cycles, events, selectedDate, onDelete, onEdit, onDeleteEvent, onEditEvent }: SleepListProps) {
  const { user } = useAuth()
  const { sleepState } = useSleepState()
  const dailyCycles = cycles.filter((cycle) => cycle.date === selectedDate)
  const dailyEvents = events.filter((event) => event.date === selectedDate)
  const items: DailyItem[] = [
    ...dailyCycles.map((cycle) => ({ kind: 'sleep' as const, time: cycle.start.toMillis(), cycle })),
    ...dailyEvents.map((event) => ({ kind: 'event' as const, time: event.timestamp.toMillis(), event })),
  ].sort((left, right) => right.time - left.time)
  const mostRecentCompletedId = cycles.filter((cycle) => !cycle.inProgress).sort((left, right) => right.start.toMillis() - left.start.toMillis())[0]?.id ?? null
  const sleepInProgress = sleepState.inProgress || cycles.some((cycle) => cycle.inProgress)

  async function onResume(cycle: SleepCycle) {
    if (!user || sleepInProgress) return
    await resumeSleep(user.uid, cycle.id, cycle.start)
  }

  return (
    <section className="rounded-2xl border border-[#ded8cc] bg-[#fffdf8] px-5 py-2 dark:border-[#3a4a45] dark:bg-[#233029]" aria-labelledby="sleep-list-title">
      <div className="flex items-center justify-between border-b border-[#e6e0d5] py-4 dark:border-[#33423c]"><h2 id="sleep-list-title" className="font-display text-2xl">Daily records</h2><span className="text-sm text-[#8a9189] dark:text-[#8ba090]">{items.length} {items.length === 1 ? 'entry' : 'entries'}</span></div>
      {items.length === 0 ? <p className="py-8 text-center text-[#8a9189] dark:text-[#8ba090]">No records yet</p> : items.map((item) =>
        item.kind === 'sleep'
          ? <SleepEntry key={item.cycle.id} cycle={item.cycle} onDelete={onDelete} onEdit={onEdit} showResume={!sleepInProgress && item.cycle.id === mostRecentCompletedId} onResume={onResume} />
          : <EventEntry key={item.event.id} event={item.event} onDelete={onDeleteEvent} onEdit={onEditEvent} />
      )}
    </section>
  )
}
