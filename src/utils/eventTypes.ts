export type EventType = 'wet' | 'poopy' | 'breastfeed' | 'bottle' | 'solid'

export const EVENT_TYPES: EventType[] = ['wet', 'poopy', 'breastfeed', 'bottle', 'solid']

export const EVENT_META: Record<EventType, { icon: string; label: string }> = {
  wet: { icon: '💧', label: 'Wet nappy' },
  poopy: { icon: '💩', label: 'Poopy nappy' },
  breastfeed: { icon: '🤱', label: 'Breastfeed' },
  bottle: { icon: '🍼', label: 'Bottle feed' },
  solid: { icon: '🥣', label: 'Solid food' },
}
