import { FormEvent, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import type { BabyEvent } from '../context/EventsContext'
import { EVENT_META } from '../utils/eventTypes'
import { dateTimeLocalToTimestamp, timestampToDateTimeLocal } from '../utils/nzTime'

type EditEventModalProps = { event: BabyEvent; onSave: (timestamp: Timestamp) => Promise<void>; onClose: () => void }

export function EditEventModal({ event, onSave, onClose }: EditEventModalProps) {
  const [timestamp, setTimestamp] = useState(timestampToDateTimeLocal(event.timestamp))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const meta = EVENT_META[event.type]

  async function submit(formEvent: FormEvent) {
    formEvent.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onSave(dateTimeLocalToTimestamp(timestamp))
      onClose()
    } catch {
      setError('Unable to save this event.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-[#24302d]/40 p-3 sm:items-center dark:bg-black/60" role="presentation" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget) onClose() }}>
      <section className="w-full max-w-md rounded-3xl bg-[#fffdf8] p-6 shadow-2xl dark:bg-[#233029]" role="dialog" aria-modal="true" aria-labelledby="edit-event-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56c45]">Adjust record</p>
            <h2 id="edit-event-title" className="mt-1 flex items-center gap-2 font-display text-2xl"><span aria-hidden>{meta.icon}</span> {meta.label}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close edit dialog" onClick={onClose}>×</button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold">Time<input className="field mt-2 [color-scheme:light] dark:[color-scheme:dark]" type="datetime-local" value={timestamp} onChange={(inputEvent) => setTimestamp(inputEvent.target.value)} required /></label>
          {error && <p className="text-sm text-[#913f2b] dark:text-[#f0a58e]" role="alert">{error}</p>}
          <div className="flex gap-3 pt-2"><button className="button-secondary flex-1" type="button" onClick={onClose}>Cancel</button><button className="button-primary flex-1" type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button></div>
        </form>
      </section>
    </div>
  )
}
