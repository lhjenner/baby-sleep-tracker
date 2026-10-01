import { FormEvent, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import type { BabyEvent } from '../context/EventsContext'
import { EVENT_META, type BottleSubtype } from '../utils/eventTypes'
import { dateTimeLocalToTimestamp, timestampToDateTimeLocal } from '../utils/nzTime'

type EditEventModalProps = {
  event: BabyEvent
  onSave: (timestamp: Timestamp, subtype?: BottleSubtype) => Promise<void>
  onClose: () => void
}

export function EditEventModal({ event, onSave, onClose }: EditEventModalProps) {
  const [timestamp, setTimestamp] = useState(timestampToDateTimeLocal(event.timestamp))
  const [subtype, setSubtype] = useState<BottleSubtype>(event.subtype ?? 'formula')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const meta = EVENT_META[event.type]

  async function submit(formEvent: FormEvent) {
    formEvent.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onSave(dateTimeLocalToTimestamp(timestamp), event.type === 'bottle' ? subtype : undefined)
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
          {event.type === 'bottle' && (
            <div>
              <span className="block text-sm font-semibold">Feed type</span>
              <div className="mt-2 inline-flex w-full rounded-xl border border-[#d8d2c4] bg-[#f4f1e9] p-1 text-sm dark:border-[#3a4a45] dark:bg-[#1b2422]" role="group" aria-label="Bottle feed type">
                <button
                  type="button"
                  className={`flex-1 rounded-lg py-2 font-semibold transition ${
                    subtype === 'formula'
                      ? 'bg-[#fffdf8] text-[#24302d] shadow-sm dark:bg-[#233029] dark:text-[#eef1ee]'
                      : 'text-[#68716b] hover:text-[#24302d] dark:text-[#9aa89f] dark:hover:text-[#eef1ee]'
                  }`}
                  aria-pressed={subtype === 'formula'}
                  onClick={() => setSubtype('formula')}
                >
                  Formula
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-lg py-2 font-semibold transition ${
                    subtype === 'breastmilk'
                      ? 'bg-[#fffdf8] text-[#24302d] shadow-sm dark:bg-[#233029] dark:text-[#eef1ee]'
                      : 'text-[#68716b] hover:text-[#24302d] dark:text-[#9aa89f] dark:hover:text-[#eef1ee]'
                  }`}
                  aria-pressed={subtype === 'breastmilk'}
                  onClick={() => setSubtype('breastmilk')}
                >
                  Breast milk
                </button>
              </div>
            </div>
          )}
          <label className="block text-sm font-semibold">Time<input className="field mt-2 [color-scheme:light] dark:[color-scheme:dark]" type="datetime-local" value={timestamp} onChange={(inputEvent) => setTimestamp(inputEvent.target.value)} required /></label>
          {error && <p className="text-sm text-[#913f2b] dark:text-[#f0a58e]" role="alert">{error}</p>}
          <div className="flex gap-3 pt-2"><button className="button-secondary flex-1" type="button" onClick={onClose}>Cancel</button><button className="button-primary flex-1" type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button></div>
        </form>
      </section>
    </div>
  )
}
