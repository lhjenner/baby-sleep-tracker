import { useState } from 'react'
import type { SleepCycle } from '../context/SleepContext'
import { formatDuration } from '../utils/formatDuration'
import { formatNzTime } from '../utils/nzTime'
import { DeleteSleepModal } from './DeleteSleepModal'
import { EditSleepModal } from './EditSleepModal'

type SleepEntryProps = { cycle: SleepCycle; onDelete: (cycle: SleepCycle) => Promise<void>; onEdit: (cycle: SleepCycle, start: import('firebase/firestore').Timestamp, end: import('firebase/firestore').Timestamp | null) => Promise<void>; showResume?: boolean; onResume?: (cycle: SleepCycle) => Promise<void> }

export function SleepEntry({ cycle, onDelete, onEdit, showResume = false, onResume }: SleepEntryProps) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [resuming, setResuming] = useState(false)

  async function handleResume() {
    if (!onResume || resuming) return
    setResuming(true)
    try { await onResume(cycle) } finally { setResuming(false) }
  }

  return (
    <>
      <article className="flex items-center justify-between gap-4 border-b border-[#e6e0d5] py-4 last:border-b-0 dark:border-[#33423c]">
        <div className="min-w-0"><p className="font-semibold text-[#24302d] dark:text-[#eef1ee]">{formatNzTime(cycle.start)} <span className="font-normal text-[#9aa098] dark:text-[#7c8a80]">to</span> {formatNzTime(cycle.end)}</p><p className="mt-1 text-sm text-[#68716b] dark:text-[#9aa89f]">{formatDuration(cycle.durationMs)}</p></div>
        <div className="flex shrink-0 gap-3 text-sm font-semibold">{showResume && <button className="text-[#3d6b4f] underline underline-offset-4 disabled:opacity-50 dark:text-[#8fc7a8]" type="button" disabled={resuming} onClick={handleResume}>{resuming ? 'Resuming...' : 'Resume'}</button>}<button className="text-[#b56c45] underline underline-offset-4 dark:text-[#e4a37c]" type="button" onClick={() => setEditing(true)}>Edit</button><button className="text-[#913f2b] underline underline-offset-4 dark:text-[#f0a58e]" type="button" onClick={() => setDeleting(true)}>Delete</button></div>
      </article>
      {editing && <EditSleepModal cycle={cycle} onSave={(start, end) => onEdit(cycle, start, end)} onClose={() => setEditing(false)} />}
      {deleting && <DeleteSleepModal cycle={cycle} onConfirm={() => onDelete(cycle)} onClose={() => setDeleting(false)} />}
    </>
  )
}
