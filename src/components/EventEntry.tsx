import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import type { BabyEvent } from '../context/EventsContext'
import { EVENT_META, getBottleSubtypeLabel, type BottleSubtype } from '../utils/eventTypes'
import { formatNzTime } from '../utils/nzTime'
import { DeleteEventModal } from './DeleteEventModal'
import { EditEventModal } from './EditEventModal'

type EventEntryProps = {
  event: BabyEvent
  onDelete: (event: BabyEvent) => Promise<void>
  onEdit: (event: BabyEvent, timestamp: Timestamp, subtype?: BottleSubtype) => Promise<void>
}

export function EventEntry({ event, onDelete, onEdit }: EventEntryProps) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [updatingSubtype, setUpdatingSubtype] = useState(false)
  const meta = EVENT_META[event.type]
  const currentSubtype: BottleSubtype = event.type === 'bottle' ? (event.subtype ?? 'formula') : 'formula'
  const displayLabel = event.type === 'bottle'
    ? `${meta.label} \u2014 ${getBottleSubtypeLabel(currentSubtype)}`
    : meta.label

  async function handleSubtypeChange(nextSubtype: BottleSubtype) {
    if (nextSubtype === currentSubtype || updatingSubtype) return
    setUpdatingSubtype(true)
    try {
      await onEdit(event, event.timestamp, nextSubtype)
    } finally {
      setUpdatingSubtype(false)
    }
  }

  return (
    <>
      <article className="border-b border-[#e6e0d5] py-2 text-sm last:border-b-0 dark:border-[#33423c]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span aria-hidden>{meta.icon}</span>
            <p className="truncate text-[#24302d] dark:text-[#eef1ee]">
              {displayLabel} <span className="text-[#68716b] dark:text-[#9aa89f]">· {formatNzTime(event.timestamp)}</span>
            </p>
          </div>
          <div className="flex shrink-0 gap-2 text-xs font-semibold">
            <button className="text-[#b56c45] underline underline-offset-4 dark:text-[#e4a37c]" type="button" onClick={() => setEditing(true)}>Edit</button>
            <button className="text-[#913f2b] underline underline-offset-4 dark:text-[#f0a58e]" type="button" onClick={() => setDeleting(true)}>Delete</button>
          </div>
        </div>
        {event.type === 'bottle' && (
          <div className="mt-2 flex items-center pl-6">
            <div className="inline-flex rounded-lg border border-[#d8d2c4] bg-[#f4f1e9] p-0.5 text-xs dark:border-[#3a4a45] dark:bg-[#1b2422]" role="group" aria-label="Bottle feed type">
              <button
                type="button"
                className={`rounded-md px-2.5 py-1 font-semibold transition ${
                  currentSubtype === 'formula'
                    ? 'bg-[#fffdf8] text-[#24302d] shadow-sm dark:bg-[#233029] dark:text-[#eef1ee]'
                    : 'text-[#68716b] hover:text-[#24302d] dark:text-[#9aa89f] dark:hover:text-[#eef1ee]'
                }`}
                disabled={updatingSubtype}
                aria-pressed={currentSubtype === 'formula'}
                onClick={() => handleSubtypeChange('formula')}
              >
                Formula
              </button>
              <button
                type="button"
                className={`rounded-md px-2.5 py-1 font-semibold transition ${
                  currentSubtype === 'breastmilk'
                    ? 'bg-[#fffdf8] text-[#24302d] shadow-sm dark:bg-[#233029] dark:text-[#eef1ee]'
                    : 'text-[#68716b] hover:text-[#24302d] dark:text-[#9aa89f] dark:hover:text-[#eef1ee]'
                }`}
                disabled={updatingSubtype}
                aria-pressed={currentSubtype === 'breastmilk'}
                onClick={() => handleSubtypeChange('breastmilk')}
              >
                Breast milk
              </button>
            </div>
          </div>
        )}
      </article>
      {editing && (
        <EditEventModal
          event={event}
          onSave={(timestamp, subtype) => onEdit(event, timestamp, subtype)}
          onClose={() => setEditing(false)}
        />
      )}
      {deleting && <DeleteEventModal event={event} onConfirm={() => onDelete(event)} onClose={() => setDeleting(false)} />}
    </>
  )
}
