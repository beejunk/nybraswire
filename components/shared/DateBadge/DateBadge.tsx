import React, { useContext, useEffect, useState } from 'react';

import {
  getMonthStr,
  appendSuffixToDate,
  getFormattedTime,
} from '../../../utils/dateUtils';
import ThemeContext from '../../../theme';

type Props = {
  timestamp: number;
};

const DateBadge: React.FunctionComponent<Props> = function DateBadge(props) {
  const { timestamp } = props;
  const { colors } = useContext(ThemeContext);
  const date = new Date(timestamp);
  const dayOfMonth = appendSuffixToDate(date.getDate());
  const month = getMonthStr(date.getMonth());
  const year = date.getFullYear();
  const time = getFormattedTime(date);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
        width: '5rem',
        height: '5rem',
        minWidth: '5rem',
      }}
    >
      {/* Render date client-side only to avoid differences between server/client */}
      {hasMounted && (
        <>
          <div css={{ fontSize: '0.5rem', lineHeight: '0.5rem' }}>{year}</div>
          <div css={{ fontWeight: 700 }}>{month}</div>
          <div>{dayOfMonth}</div>
          <div css={{ fontSize: '0.5rem', lineHeight: '0.75rem' }}>{time}</div>
        </>
      )}
    </div>
  );
};

export default DateBadge;
