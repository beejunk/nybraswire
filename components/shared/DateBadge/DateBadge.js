// @flow

import React, { useContext } from 'react';
import { getMonthStr, appendSuffixToDate, getFormattedTime } from '../../../utils/dateUtils';
import ThemeContext from '../../../theme';

type Props = {
  timestamp: number,
};

const DateBadge = (props: Props) => {
  const { timestamp } = props;
  const { colors } = useContext(ThemeContext);
  const date = new Date(timestamp);
  const dayOfMonth = appendSuffixToDate(date.getDate());
  const month = getMonthStr(date.getMonth());
  const time = getFormattedTime(date);

  // TODO: Why is minWidth necessary here?
  return (
    <div
      className="DateBadge"
      css={{
        borderRadius: '5px',
        backgroundColor: colors.gray900,
        display: 'flex',
        color: '#fff',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1.25rem',
        width: '4.5rem',
        height: '4.5rem',
        minWidth: '4.5rem',
      }}
    >
      <div css={{ fontWeight: 700 }}>{month}</div>
      <div>{dayOfMonth}</div>
      <div css={{ fontSize: '0.5rem' }}>{time}</div>
    </div>
  );
};

export default DateBadge;
