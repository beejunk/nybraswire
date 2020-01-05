import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { NextPage } from 'next';

import firebase from '../firebase';
import Layout from '../components/shared/Layout';
import PostArticle from '../components/posts/PostArticle';
import PostCacheContext from '../utils/PostCacheContext';
import ThemeContext from '../theme';
import { PostCacheType } from '../types/posts';

const DEFAULT_STATE = {
  postCache: { postsById: {}, postIds: [] },
  currentPageIds: [],
};

type State = {
  postCache: PostCacheType;
  currentPageIds: string[];
};

type ThemeSettings = {
  header: string;
};

type Props = {
  theme: ThemeSettings;
  initialPosts: PostCacheType;
}

const PAGE_TITLE = 'Recent Posts';

const POSTS_PER_PAGE = 5;

/**
 * Retrieve the initial set of posts to be stored in the post-cache.
 */
async function getInitialPosts(setState: (state: State) => void): Promise<void> {
  let firestore = firebase.firestore();
  let postCollection = firestore.collection('posts');
  let postIds = [];
  let postsById = {};

  let query = postCollection
    .orderBy('postedOn', 'desc')
    .limit(POSTS_PER_PAGE * 2);

  let querySnapshot = await query.get();

  querySnapshot.forEach((doc) => {
    postIds.push(doc.id);
    postsById[doc.id] = doc.data();
  });

  setState({
    postCache: { postIds, postsById },
    currentPageIds: postIds,
  });
}

/**
 * Indicates if there is a next page of posts.
 */
function hasNextPage(state: State): boolean {
  let { currentPageIds, postCache } = state;
  let { postIds } = postCache;

  if (currentPageIds.length) {
    let lastPostId = currentPageIds[currentPageIds.length - 1];

    return postIds.indexOf(lastPostId) < postIds.length - 1;
  }

  return false;
}

/**
 * Indicates if there is a previous page of posts.
 */
function hasPrevPage(state: State): boolean {
  let { currentPageIds, postCache } = state;
  let { postIds } = postCache;

  if (currentPageIds.length) {
    const firstPostId = currentPageIds[0];

    return postIds.indexOf(firstPostId) > 0;
  }

  return false;
}

/**
 * Set the current page to the previous page.
 */
function setPrevPage(props: {
  state: State;
  setState: (state: State) => void;
}): void {
  let { state, setState } = props;
  let { postCache, currentPageIds } = state;
  let { postIds } = postCache;
  let firstPostIndex = postIds.indexOf(currentPageIds[0]);
  let prevPageIds = postIds.slice(firstPostIndex - POSTS_PER_PAGE, firstPostIndex);

  setState({ ...state, currentPageIds: prevPageIds });
}

/**
 * Set the current page to the next page.
 */
function setNextPage(props: {
  state: State;
  setState: (state: State) => void;
}): void {
  let { state, setState } = props;
  let { currentPageIds, postCache } = state;
  let { postIds } = postCache;
  let lastPostId = currentPageIds[currentPageIds.length - 1];
  let lastPostIndex = postIds.indexOf(lastPostId);
  let start = lastPostIndex + 1;
  let end = lastPostIndex + POSTS_PER_PAGE + 1;
  let nextPageIds = postIds.slice(start, end);

  setState({ ...state, currentPageIds: nextPageIds });
}

/**
 * Retrieve the next page of posts and add them to the cache.
 */
async function addPostsToCache(props: {
  state: State;
  setState: (state: State) => void;
}): Promise<void> {
  let { state, setState } = props;
  let { currentPageIds, postCache } = state;
  let { postIds, postsById } = postCache;
  let firestore = firebase.firestore();
  let postCollection = firestore.collection('posts');
  let lastPostId = currentPageIds[currentPageIds.length - 1];
  let newPostIds = [];
  let newPostsById = {};
  let lastDocRef = postCollection.doc(lastPostId);

  let lastDocSnapshot = await lastDocRef.get();

  let query = postCollection
    .orderBy('postedOn', 'desc')
    .limit(POSTS_PER_PAGE)
    .startAfter(lastDocSnapshot);

  let querySnapshot = await query.get();

  querySnapshot.forEach((doc) => {
    newPostIds.push(doc.id);
    newPostsById[doc.id] = doc.data();
  });

  setState({
    ...state,
    postCache: {
      postIds: [...postIds, ...newPostIds],
      postsById: { ...postsById, ...newPostsById },
    },
  });
}

const Index: NextPage<Props> = function Index() {
  let [state, setState] = useState(DEFAULT_STATE);
  let defaultTheme = useContext(ThemeContext);
  let { postCache, currentPageIds } = state;

  useEffect(() => {
    let pageIsFull = currentPageIds.length === POSTS_PER_PAGE;

    if (!currentPageIds.length) {
      getInitialPosts(setState);
    }

    if (pageIsFull && !hasNextPage(state)) {
      addPostsToCache({ state, setState });
    }
  }, [currentPageIds]);

  return (
    <PostCacheContext.Provider value={postCache}>
      <ThemeContext.Provider value={defaultTheme}>
        <Layout title={PAGE_TITLE}>
          {currentPageIds.map((id) => (
            <PostArticle
              key={id}
              post={postCache.postsById[id]}
              postId={id}
              summary
            />
          ))}

          <Row>
            {hasPrevPage(state) && (
              <Col xs={4} sm={3} md={2}>
                <Button
                  onClick={(): void => {
                    setPrevPage({ state, setState });
                  }}
                  block
                >
                  Previous
                </Button>
              </Col>
            )}

            {hasNextPage(state) && (
              <Col xs={4} sm={3} md={2}>
                <Button
                  onClick={(): void => {
                    setNextPage({ state, setState });
                  }}
                  block
                >
                  Next
                </Button>
              </Col>
            )}
          </Row>
        </Layout>
      </ThemeContext.Provider>
    </PostCacheContext.Provider>
  );
};

export default Index;
