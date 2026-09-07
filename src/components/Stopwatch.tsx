import { useEffect, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { formatStopwatch } from '../utils/formatDuration'

type StopwatchProps = { start: Timestamp | null }

export function Stopwatch({ start }: StopwatchProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!start) return undefined
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [start])

  if (!start) return null
  return (
    <div className="rounded-2xl bg-[#24302d] px-5 py-4 text-[#fffdf8] shadow-[0_12px_30px_rgba(36,48,45,0.18)] dark:bg-[#0f1614] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8c9b7]">Current sleep</p>
      <p className="mt-1 font-mono text-4xl tracking-wider">{formatStopwatch(now - start.toMillis())}</p>
    </div>
  )
}
