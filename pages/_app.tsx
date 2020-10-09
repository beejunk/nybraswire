import React from 'react';
import { AppProps } from 'next/app';
import 'highlight.js/styles/solarized-dark.css';

import '../theme/highlight';
import '../styles/theme.scss';

const NybrasWireApp: React.FC<AppProps> = function NybrasWireApp({
  Component,
  pageProps,
}) {
  // eslint-disable-next-line
  return <Component {...pageProps} />;
};

export default NybrasWireApp;
