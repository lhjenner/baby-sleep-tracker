import { format, parseISO, addDays, isAfter, isBefore } from 'date-fns'
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'
import { Timestamp } from 'firebase/firestore'

export const NZ_TIME_ZONE = 'Pacific/Auckland'

export function getNzDateString(date: Date = new Date()): string {
  return formatInTimeZone(date, NZ_TIME_ZONE, 'yyyy-MM-dd')
}

export function formatNzTime(value: Timestamp | Date | null): string {
  if (!value) return 'In progress'
  const date = value instanceof Timestamp ? value.toDate() : value
  return formatInTimeZone(date, NZ_TIME_ZONE, 'h:mm a')
}

export function formatNzDateLabel(dateString: string): string {
  return format(parseISO(dateString), 'EEE, d MMM yyyy')
}

export function shiftNzDate(dateString: string, amount: number): string {
  return format(addDays(parseISO(dateString), amount), 'yyyy-MM-dd')
}

export function isNzDateToday(dateString: string): boolean {
  return dateString === getNzDateString()
}

export function isValidDateRange(start: string, end: string): boolean {
  return !isAfter(parseISO(start), parseISO(end))
}

export function dateTimeLocalToTimestamp(value: string): Timestamp {
  return Timestamp.fromDate(fromZonedTime(value, NZ_TIME_ZONE))
}

export function timestampToDateTimeLocal(value: Timestamp): string {
  return formatInTimeZone(value.toDate(), NZ_TIME_ZONE, "yyyy-MM-dd'T'HH:mm")
}

export function isTimestampBefore(left: Timestamp, right: Timestamp): boolean {
  return isBefore(left.toDate(), right.toDate())
}
