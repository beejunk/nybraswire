const MONTHS = [
  'Jan.',
  'Feb.',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'Sep.',
  'Oct.',
  'Nov.',
  'Dec.',
];

function getLocalISOFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(timestamp - offset);

  return localDate.toISOString().split('.')[0];
}

function replaceISOSegment(timestamp: number, segmentIdx: 0 | 1, value: string): number {
  const isoSegments = getLocalISOFromTimestamp(timestamp).split('T');

  isoSegments[segmentIdx] = value;

  return new Date(isoSegments.join('T')).getTime();
}

export function getMonthStr(monthIdx: number): string {
  return MONTHS[monthIdx];
}

export function appendSuffixToDate(date: number): string {
  const dateStr = String(date);
  const lastNbr = dateStr.slice(-1);

  if (date > 3 && date < 20) {
    return `${dateStr}th`;
  }

  switch (lastNbr) {
    case '1':
      return `${dateStr}st`;
    case '2':
      return `${dateStr}nd`;
    case '3':
      return `${dateStr}rd`;
    default:
      return `${dateStr}th`;
  }
}

export function updateDate(timestamp: number, dateISO: string): number {
  return replaceISOSegment(timestamp, 0, dateISO);
}

export function updateTime(timestamp: number, timeISO: string): number {
  return replaceISOSegment(timestamp, 1, timeISO);
}

export function getLocalDate(timestamp: number): string {
  return getLocalISOFromTimestamp(timestamp).split('T')[0];
}

export function getLocalTime(timestamp: number): string {
  return getLocalISOFromTimestamp(timestamp).split('T')[1];
}

export function getFormattedTime(date: Date): string {
  const hours = date.getHours() % 12;
  const period = date.getHours() < 12 ? 'am' : 'pm';
  const minutes = date.getMinutes();

  return `${hours}:${minutes} ${period}`;
}
