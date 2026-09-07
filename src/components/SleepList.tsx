import type { SleepCycle } from '../context/SleepContext'
import { SleepEntry } from './SleepEntry'

type SleepListProps = { cycles: SleepCycle[]; selectedDate: string; onDelete: (cycle: SleepCycle) => Promise<void>; onEdit: (cycle: SleepCycle, start: import('firebase/firestore').Timestamp, end: import('firebase/firestore').Timestamp) => Promise<void> }

export function SleepList({ cycles, selectedDate, onDelete, onEdit }: SleepListProps) {
  const dailyCycles = cycles.filter((cycle) => cycle.date === selectedDate).sort((left, right) => right.start.toMillis() - left.start.toMillis())
  return (
    <section className="rounded-2xl border border-[#ded8cc] bg-[#fffdf8] px-5 py-2 dark:border-[#3a4a45] dark:bg-[#233029]" aria-labelledby="sleep-list-title">
      <div className="flex items-center justify-between border-b border-[#e6e0d5] py-4 dark:border-[#33423c]"><h2 id="sleep-list-title" className="font-display text-2xl">Sleep records</h2><span className="text-sm text-[#8a9189] dark:text-[#8ba090]">{dailyCycles.length} {dailyCycles.length === 1 ? 'entry' : 'entries'}</span></div>
      {dailyCycles.length === 0 ? <p className="py-8 text-center text-[#8a9189] dark:text-[#8ba090]">No sleeps yet</p> : dailyCycles.map((cycle) => <SleepEntry key={cycle.id} cycle={cycle} onDelete={onDelete} onEdit={onEdit} />)}
    </section>
  )
}
