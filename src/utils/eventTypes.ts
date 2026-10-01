export type EventType = 'wet' | 'poopy' | 'breastfeed' | 'bottle' | 'solid'

export const EVENT_TYPES: EventType[] = ['wet', 'poopy', 'breastfeed', 'bottle', 'solid']

export type BottleSubtype = 'formula' | 'breastmilk'

export const BOTTLE_SUBTYPES: BottleSubtype[] = ['formula', 'breastmilk']

export const BOTTLE_SUBTYPE_LABELS: Record<BottleSubtype, string> = {
  formula: 'Formula',
  breastmilk: 'Breast milk',
}

export function getBottleSubtypeLabel(subtype?: BottleSubtype): string {
  return BOTTLE_SUBTYPE_LABELS[subtype ?? 'formula']
}

export const EVENT_META: Record<EventType, { icon: string; label: string }> = {
  wet: { icon: '💧', label: 'Wet nappy' },
  poopy: { icon: '💩', label: 'Poopy nappy' },
  breastfeed: { icon: '🤱', label: 'Breastfeed' },
  bottle: { icon: '🍼', label: 'Bottle feed' },
  solid: { icon: '🥣', label: 'Solid food' },
}
