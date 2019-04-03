import React from 'react';
import App, { Container } from 'next/app';
import fb from '../firebase';
import ThemeContext from '../theme';
import { GlobalStyles, theme } from '../theme/nybraswire';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx, fb);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ThemeContext.Provider value={theme}>
          <Component {...pageProps} />
        </ThemeContext.Provider>

        <GlobalStyles />
      </Container>
    );
  }
}

export default MyApp;
