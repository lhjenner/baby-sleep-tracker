import { EVENT_META, EVENT_TYPES, type EventType } from '../utils/eventTypes'

type EventButtonsProps = { onCreate: (type: EventType) => void; busy: boolean }

export function EventButtons({ onCreate, busy }: EventButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {EVENT_TYPES.map((type) => (
        <button
          key={type}
          className="icon-button mx-auto"
          type="button"
          disabled={busy}
          aria-label={EVENT_META[type].label}
          onClick={() => onCreate(type)}
        >
          {EVENT_META[type].icon}
        </button>
      ))}
    </div>
  )
}
