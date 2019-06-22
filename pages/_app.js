import React from 'react';
import App, { Container } from 'next/app';
import firebase from '../firebase';
import ThemeContext from '../theme';
import theme from '../theme/nybraswire';

class MyApp extends App<Props, State> {
  state = {
    postIds: [],
    postsById: {},
  };

  constructor(props) {
    super(props);

    // NOTE: Theme settings are intended to be fetched only once on initial
    // server render and then made available to components via this property.
    this.themeSettings = props.themeSettings;
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    let themeSettings;

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx, firebase);
    }

    if (ctx.req) {
      const firestore = firebase.firestore();
      const themeSettingsDoc = await firestore.collection('settings').doc('theme').get();
      themeSettings = themeSettingsDoc.data();
    }

    return { pageProps, themeSettings };
  }

  addPostsToCache = (posts = { postsBydId: {}, postIds: [] }) => {
    const { postIds } = this.state;
    const newPostIds = posts.postIds.filter(postId => !postIds.includes(postId));
    const newPostsById = {};


    if (newPostIds.length) {
      newPostIds.forEach((postId) => {
        newPostsById[postId] = posts.postsById[postId];
      });

      this.setState({ postIds: newPostIds, postsById: newPostsById });
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    const { postIds, postsById } = this.state;

    return (
      <Container>
        <ThemeContext.Provider value={{ ...theme, ...this.themeSettings }}>
          <Component
            {...pageProps}
            postCache={{ postIds, postsById }}
            addPostsToCache={this.addPostsToCache}
          />
        </ThemeContext.Provider>
      </Container>
    );
  }
}

export default MyApp;
