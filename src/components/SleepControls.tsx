type SleepControlsProps = { inProgress: boolean; onStart: () => void; onFinish: () => void; busy: boolean }

export function SleepControls({ inProgress, onStart, onFinish, busy }: SleepControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button className="button-primary min-h-16 text-lg" type="button" disabled={inProgress || busy} onClick={onStart}>Asleep</button>
      <button className="button-secondary min-h-16 text-lg" type="button" disabled={!inProgress || busy} onClick={onFinish}>Awake</button>
    </div>
  )
}
