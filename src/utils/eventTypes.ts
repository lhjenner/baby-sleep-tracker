export type EventType = 'wet' | 'poopy' | 'breastfeed' | 'solid'

export const EVENT_TYPES: EventType[] = ['wet', 'poopy', 'breastfeed', 'solid']

export const EVENT_META: Record<EventType, { icon: string; label: string }> = {
  wet: { icon: '💧', label: 'Wet nappy' },
  poopy: { icon: '💩', label: 'Poopy nappy' },
  breastfeed: { icon: '🤱', label: 'Breastfeed' },
  solid: { icon: '🥣', label: 'Solid food' },
}
