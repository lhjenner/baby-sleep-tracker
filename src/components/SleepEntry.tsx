import { useState } from 'react'
import type { SleepCycle } from '../context/SleepContext'
import { formatDuration } from '../utils/formatDuration'
import { formatNzTime } from '../utils/nzTime'
import { EditSleepModal } from './EditSleepModal'

type SleepEntryProps = { cycle: SleepCycle; onDelete: (cycle: SleepCycle) => Promise<void>; onEdit: (cycle: SleepCycle, start: import('firebase/firestore').Timestamp, end: import('firebase/firestore').Timestamp) => Promise<void> }

export function SleepEntry({ cycle, onDelete, onEdit }: SleepEntryProps) {
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)

  async function deleteEntry() {
    setBusy(true)
    try { await onDelete(cycle) } finally { setBusy(false) }
  }

  return (
    <>
      <article className="flex items-center justify-between gap-4 border-b border-[#e6e0d5] py-4 last:border-b-0">
        <div className="min-w-0"><p className="font-semibold text-[#24302d]">{formatNzTime(cycle.start)} <span className="font-normal text-[#9aa098]">to</span> {formatNzTime(cycle.end)}</p><p className="mt-1 text-sm text-[#68716b]">{formatDuration(cycle.durationMs)}</p></div>
        <div className="flex shrink-0 gap-3 text-sm font-semibold"><button className="text-[#b56c45] underline underline-offset-4" type="button" disabled={busy || cycle.inProgress} onClick={() => setEditing(true)}>Edit</button><button className="text-[#913f2b] underline underline-offset-4" type="button" disabled={busy} onClick={deleteEntry}>Delete</button></div>
      </article>
      {editing && <EditSleepModal cycle={cycle} onSave={(start, end) => onEdit(cycle, start, end)} onClose={() => setEditing(false)} />}
    </>
  )
}
