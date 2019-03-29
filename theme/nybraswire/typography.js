import { css } from '@emotion/core';
import colors from './colors';

export default css({
  html: {
    fontSize: 15,
    fontFamily: 'Frutiger, "Frutiger Linotype", Univers, Calibri, "Gill Sans", "Gill Sans MT", "Myriad Pro", Myriad, "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif',
  },

  h1: {
    fontSize: '4rem',
  },

  h2: {
    fontSize: '3rem',
  },

  h3: {
    fontSize: '2rem',
  },

  'a, a:hover, a:visited, a:focus': {
    color: colors.secondary,
    textDecoration: 'none',
  },
});
