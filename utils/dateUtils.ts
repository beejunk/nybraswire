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

const getLocalISOFromTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(timestamp - offset);

  return localDate.toISOString().split('.')[0];
};

const replaceISOSegment = (timestamp: number, segmentIdx: 0 | 1, value: string): number => {
  const isoSegments = getLocalISOFromTimestamp(timestamp).split('T');

  isoSegments[segmentIdx] = value;

  return new Date(isoSegments.join('T')).getTime();
};

export const getMonthStr = (monthIdx: number): string => MONTHS[monthIdx];

export const appendSuffixToDate = (date: number): string => (
  String(date).endsWith('2')
    ? `${date}nd`
    : `${date}th`
);

export const updateDate = (timestamp: number, dateISO: string): number => (
  replaceISOSegment(timestamp, 0, dateISO)
);

export const updateTime = (timestamp: number, timeISO: string): number => (
  replaceISOSegment(timestamp, 1, timeISO)
);

export const getLocalDate = (timestamp: number): string => (
  getLocalISOFromTimestamp(timestamp).split('T')[0]
);

export const getLocalTime = (timestamp: number): string => (
  getLocalISOFromTimestamp(timestamp).split('T')[1]
);

export const getFormattedTime = (date: Date): string => {
  const hours = date.getHours() % 12;
  const period = date.getHours() < 12 ? 'am' : 'pm';
  const minutes = date.getMinutes();

  return `${hours}:${minutes} ${period}`;
};
