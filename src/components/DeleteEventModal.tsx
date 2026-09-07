import { useState } from 'react'
import type { BabyEvent } from '../context/EventsContext'
import { EVENT_META } from '../utils/eventTypes'
import { formatNzTime } from '../utils/nzTime'

type DeleteEventModalProps = { event: BabyEvent; onConfirm: () => Promise<void>; onClose: () => void }

export function DeleteEventModal({ event, onConfirm, onClose }: DeleteEventModalProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const meta = EVENT_META[event.type]

  async function confirmDelete() {
    setBusy(true)
    setError('')
    try {
      await onConfirm()
      onClose()
    } catch {
      setError('Unable to delete this event.')
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-[#24302d]/40 p-3 sm:items-center dark:bg-black/60" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="w-full max-w-md rounded-3xl bg-[#fffdf8] p-6 shadow-2xl dark:bg-[#233029]" role="dialog" aria-modal="true" aria-labelledby="delete-event-title">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#913f2b]">Remove record</p><h2 id="delete-event-title" className="mt-1 flex items-center gap-2 font-display text-2xl"><span aria-hidden>{meta.icon}</span> {meta.label}</h2></div>
          <button className="icon-button" type="button" aria-label="Close delete dialog" onClick={onClose}>×</button>
        </div>
        <div className="mt-6 space-y-2 rounded-2xl border border-[#e6e0d5] p-4 dark:border-[#33423c]">
          <p className="text-sm"><span className="font-semibold">Time:</span> {formatNzTime(event.timestamp)}</p>
        </div>
        <p className="mt-4 text-sm font-semibold text-[#913f2b] dark:text-[#f0a58e]">This action cannot be undone.</p>
        {error && <p className="mt-2 text-sm text-[#913f2b] dark:text-[#f0a58e]" role="alert">{error}</p>}
        <div className="flex gap-3 pt-6">
          <button className="button-secondary flex-1" type="button" disabled={busy} onClick={onClose}>Cancel</button>
          <button className="flex-1 rounded-xl bg-[#913f2b] px-5 py-3 font-bold text-[#fffdf8] transition hover:bg-[#7a3122] focus:outline-none focus:ring-2 focus:ring-[#f0a58e] focus:ring-offset-2 dark:focus:ring-offset-[#233029]" type="button" disabled={busy} onClick={confirmDelete}>{busy ? 'Deleting...' : 'Delete event'}</button>
        </div>
      </section>
    </div>
  )
}
