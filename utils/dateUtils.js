// @flow

const getLocalISOFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(timestamp - offset);

  return localDate.toISOString().split('.')[0];
};

const replaceISOSegment = (timestamp: number, segmentIdx: 0 | 1, value: string) => {
  const isoSegments = getLocalISOFromTimestamp(timestamp).split('T');

  isoSegments[segmentIdx] = value;

  return new Date(isoSegments.join('T')).getTime();
};


export const updateDate = (timestamp: number, dateISO: string) => (
  replaceISOSegment(timestamp, 0, dateISO)
);

export const updateTime = (timestamp: number, timeISO: string) => (
  replaceISOSegment(timestamp, 1, timeISO)
);

export const getLocalDate = (timestamp: number) => (
  getLocalISOFromTimestamp(timestamp).split('T')[0]
);

export const getLocalTime = (timestamp: number) => (
  getLocalISOFromTimestamp(timestamp).split('T')[1]
);
