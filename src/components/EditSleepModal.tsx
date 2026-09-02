import { FormEvent, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import type { SleepCycle } from '../context/SleepContext'
import { dateTimeLocalToTimestamp, isValidDateRange, timestampToDateTimeLocal } from '../utils/nzTime'

type EditSleepModalProps = { cycle: SleepCycle; onSave: (start: Timestamp, end: Timestamp) => Promise<void>; onClose: () => void }

export function EditSleepModal({ cycle, onSave, onClose }: EditSleepModalProps) {
  const [start, setStart] = useState(timestampToDateTimeLocal(cycle.start))
  const [end, setEnd] = useState(cycle.end ? timestampToDateTimeLocal(cycle.end) : '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!end || !isValidDateRange(start, end)) {
      setError('End time must be after start time.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await onSave(dateTimeLocalToTimestamp(start), dateTimeLocalToTimestamp(end))
      onClose()
    } catch {
      setError('Unable to save this sleep.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-[#24302d]/40 p-3 sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="w-full max-w-md rounded-3xl bg-[#fffdf8] p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="edit-sleep-title">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56c45]">Adjust record</p><h2 id="edit-sleep-title" className="mt-1 font-display text-2xl">Edit sleep</h2></div>
          <button className="icon-button" type="button" aria-label="Close edit dialog" onClick={onClose}>×</button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold">Start<input className="field mt-2" type="datetime-local" value={start} onChange={(event) => setStart(event.target.value)} required /></label>
          <label className="block text-sm font-semibold">End<input className="field mt-2" type="datetime-local" value={end} onChange={(event) => setEnd(event.target.value)} required /></label>
          {error && <p className="text-sm text-[#913f2b]" role="alert">{error}</p>}
          <div className="flex gap-3 pt-2"><button className="button-secondary flex-1" type="button" onClick={onClose}>Cancel</button><button className="button-primary flex-1" type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button></div>
        </form>
      </section>
    </div>
  )
}
