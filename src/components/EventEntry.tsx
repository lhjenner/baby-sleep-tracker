import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import type { BabyEvent } from '../context/EventsContext'
import { EVENT_META } from '../utils/eventTypes'
import { formatNzTime } from '../utils/nzTime'
import { DeleteEventModal } from './DeleteEventModal'
import { EditEventModal } from './EditEventModal'

type EventEntryProps = {
  event: BabyEvent
  onDelete: (event: BabyEvent) => Promise<void>
  onEdit: (event: BabyEvent, timestamp: Timestamp) => Promise<void>
}

export function EventEntry({ event, onDelete, onEdit }: EventEntryProps) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const meta = EVENT_META[event.type]

  return (
    <>
      <article className="flex items-center justify-between gap-3 border-b border-[#e6e0d5] py-2 text-sm last:border-b-0 dark:border-[#33423c]">
        <div className="flex min-w-0 items-center gap-2">
          <span aria-hidden>{meta.icon}</span>
          <p className="truncate text-[#24302d] dark:text-[#eef1ee]">{meta.label} <span className="text-[#68716b] dark:text-[#9aa89f]">· {formatNzTime(event.timestamp)}</span></p>
        </div>
        <div className="flex shrink-0 gap-2 text-xs font-semibold">
          <button className="text-[#b56c45] underline underline-offset-4 dark:text-[#e4a37c]" type="button" onClick={() => setEditing(true)}>Edit</button>
          <button className="text-[#913f2b] underline underline-offset-4 dark:text-[#f0a58e]" type="button" onClick={() => setDeleting(true)}>Delete</button>
        </div>
      </article>
      {editing && <EditEventModal event={event} onSave={(timestamp) => onEdit(event, timestamp)} onClose={() => setEditing(false)} />}
      {deleting && <DeleteEventModal event={event} onConfirm={() => onDelete(event)} onClose={() => setDeleting(false)} />}
    </>
  )
}
