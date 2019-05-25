// @flow

import React from 'react';
import { getMonthStr, appendSuffixToDate, getFormattedTime } from '../../../utils/dateUtils';

type Props = {
  timestamp: number,
};

const DateBadge = (props: Props) => {
  const { timestamp } = props;
  const date = new Date(timestamp);
  const dayOfMonth = appendSuffixToDate(date.getDate());
  const month = getMonthStr(date.getMonth());
  const time = getFormattedTime(date);

  return (
    <div
      className="DateBadge"
      css={{
        borderRadius: '5px',
        backgroundColor: '#000',
        display: 'flex',
        color: '#fff',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1.25rem',
        width: '4.5rem',
        height: '4.5rem',
      }}
    >
      <div css={{ fontWeight: 700 }}>{month}</div>
      <div>{dayOfMonth}</div>
      <div css={{ fontSize: '0.5rem' }}>{time}</div>
    </div>
  );
};

export default DateBadge;
