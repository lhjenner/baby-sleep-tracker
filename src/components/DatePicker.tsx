import { formatNzDateLabel, getNzDateString, isNzDateToday, shiftNzDate } from '../utils/nzTime'

type DatePickerProps = { selectedDate: string; onChange: (date: string) => void }

export function DatePicker({ selectedDate, onChange }: DatePickerProps) {
  const today = isNzDateToday(selectedDate)
  return (
    <div className="flex items-center justify-between gap-3">
      <button className="icon-button" type="button" aria-label="Previous day" onClick={() => onChange(shiftNzDate(selectedDate, -1))}>←</button>
      <label className="min-w-0 flex-1 text-center">
        <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#8a9189] dark:text-[#8ba090]">Selected day</span>
        <input className="mt-1 w-full cursor-pointer bg-transparent text-center font-display text-xl font-semibold text-[#24302d] outline-none dark:text-[#eef1ee] [color-scheme:light] dark:[color-scheme:dark]" type="date" value={selectedDate} max={getNzDateString()} onChange={(event) => onChange(event.target.value)} aria-label={formatNzDateLabel(selectedDate)} />
      </label>
      <button className="icon-button" type="button" aria-label="Next day" disabled={today} onClick={() => onChange(shiftNzDate(selectedDate, 1))}>→</button>
    </div>
  )
}
