// @flow

import React from 'react';
import App, { Container } from 'next/app';
import firebase from '../firebase';
import ThemeContext from '../theme';
import theme from '../theme/nybraswire';
import type { PostType } from '../types/posts';

const POSTS_PER_PAGE = 5;

const getInitialPage = async () => {
  const firestore = firebase.firestore();
  const postCollection = firestore.collection('posts');
  const postIds = [];
  const postsById = {};

  const query = postCollection
    .orderBy('postedOn', 'desc')
    .limit(POSTS_PER_PAGE * 2);

  const querySnapshot = await query.get();

  querySnapshot.forEach((doc) => {
    postIds.push(doc.id);
    postsById[doc.id] = doc.data();
  });

  return { postIds, postsById };
};

type State = {
  postIds: string[],
  postsById: { [id: string]: PostType },
  currentPageIds: string[],
};

class MyApp extends App {
  state: State;

  constructor(props: any) {
    super(props);

    // NOTE: Theme settings are intended to be fetched only once on initial
    // server render and then made available to components via this property.
    this.themeSettings = props.themeSettings;
    this.state = {
      postIds: props.initialPage.postIds,
      postsById: { ...props.initialPage.postsById },
      currentPageIds: props.initialPage.postIds.slice(0, POSTS_PER_PAGE),
    };
  }

  static async getInitialProps({ Component, ctx }: any) {
    let pageProps = {};
    let initialPage = {};
    let themeSettings;

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx, firebase);
    }

    if (ctx.req) {
      const firestore = firebase.firestore();
      const themeSettingsDoc = await firestore.collection('settings').doc('theme').get();

      themeSettings = themeSettingsDoc.data();
      initialPage = await getInitialPage();
    }

    return { pageProps, themeSettings, initialPage };
  }

  addPostsToCache = async () => {
    const { currentPageIds } = this.state;
    const firestore = firebase.firestore();
    const postCollection = firestore.collection('posts');
    const lastPostId = currentPageIds[currentPageIds.length - 1];
    const newPostIds = [];
    const newPostsById = {};
    const lastDocRef = postCollection.doc(lastPostId);
    const lastDocSnapshot = await lastDocRef.get();

    const query = postCollection
      .orderBy('postedOn', 'desc')
      .limit(POSTS_PER_PAGE)
      .startAfter(lastDocSnapshot);

    const querySnapshot = await query.get();

    querySnapshot.forEach((doc) => {
      newPostIds.push(doc.id);
      newPostsById[doc.id] = doc.data();
    });

    this.setState(prevState => ({
      postIds: [...prevState.postIds, ...newPostIds],
      postsById: { ...prevState.postsById, ...newPostsById },
    }));
  }

  getNextPage = () => {
    const { currentPageIds, postIds } = this.state;
    const lastPostId = currentPageIds[currentPageIds.length - 1];
    const lastPostIndex = postIds.indexOf(lastPostId);
    const start = lastPostIndex + 1;
    const end = lastPostIndex + POSTS_PER_PAGE + 1;
    const nextPageIds = postIds.slice(start, end);

    this.setState({ currentPageIds: nextPageIds });
  }

  getPrevPage = () => {
    const { currentPageIds, postIds } = this.state;
    const firstPostIndex = postIds.indexOf(currentPageIds[0]);
    const prevPageIds = postIds.slice(firstPostIndex - POSTS_PER_PAGE, firstPostIndex);

    this.setState({ currentPageIds: prevPageIds });
  }

  componentDidUpdate() {
    const { currentPageIds, postIds } = this.state;
    const lastPageIndex = postIds.indexOf(currentPageIds[currentPageIds.length - 1]);
    const pageIsFull = currentPageIds.length === POSTS_PER_PAGE;
    const hasNextPage = lastPageIndex < postIds.length - 1;

    if (pageIsFull && !hasNextPage) {
      this.addPostsToCache();
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    const { postIds, postsById, currentPageIds } = this.state;

    return (
      <Container>
        <ThemeContext.Provider value={{ ...theme, ...this.themeSettings }}>
          <Component
            {...pageProps}
            currentPageIds={currentPageIds}
            postCache={{ postIds, postsById }}
            addPostsToCache={this.addPostsToCache}
            getNextPage={this.getNextPage}
            getPrevPage={this.getPrevPage}
          />
        </ThemeContext.Provider>
      </Container>
    );
  }
}

export default MyApp;
