import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { NextPage } from 'next';

import firebase from '../firebase';
import Layout from '../components/shared/Layout';
import PostArticle from '../components/posts/PostArticle';
import PostCacheContext from '../utils/PostCacheContext';
import ThemeContext from '../theme';
import { PostType, PostCacheType } from '../types/posts';

type State = {
  postIds: string[];
  postsById: { [id: string]: PostType };
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
async function getInitialPosts(): Promise<PostCacheType> {
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

  return { postIds, postsById };
}

/**
 * Indicates if there is a next page of posts.
 */
function hasNextPage(currentPageIds: string[], postIds: string[]): boolean {
  if (currentPageIds.length) {
    let lastPostId = currentPageIds[currentPageIds.length - 1];

    return postIds.indexOf(lastPostId) < postIds.length - 1;
  }

  return false;
}

/**
 * Indicates if there is a previous page of posts.
 */
function hasPrevPage(currentPageIds: string[], postIds: string[]): boolean {
  if (currentPageIds.length) {
    const firstPostId = currentPageIds[0];

    return postIds.indexOf(firstPostId) > 0;
  }

  return false;
}

/**
 * Use the provided hook to set the current page to the previous page.
 */
function setPrevPage(props: {
  postCache: PostCacheType;
  currentPageIds: string[];
  setCurrentPageIds: (ids: string[]) => void;
}): void {
  let { postCache, currentPageIds, setCurrentPageIds } = props;
  let { postIds } = postCache;
  let firstPostIndex = postIds.indexOf(currentPageIds[0]);
  let prevPageIds = postIds.slice(firstPostIndex - POSTS_PER_PAGE, firstPostIndex);

  setCurrentPageIds(prevPageIds);
}

/**
 * Use the provided hook to set the current page to the next page.
 */
function setNextPage(props: {
  postCache: PostCacheType;
  currentPageIds: string[];
  setCurrentPageIds: (ids: string[]) => void;
}): void {
  let { currentPageIds, postCache, setCurrentPageIds } = props;
  let { postIds } = postCache;
  let lastPostId = currentPageIds[currentPageIds.length - 1];
  let lastPostIndex = postIds.indexOf(lastPostId);
  let start = lastPostIndex + 1;
  let end = lastPostIndex + POSTS_PER_PAGE + 1;
  let nextPageIds = postIds.slice(start, end);

  setCurrentPageIds(nextPageIds);
}

/**
 * Retrieve the next page of posts and add them to the cache.
 */
async function addPostsToCache(props: {
  currentPageIds: string[];
  postCache: PostCacheType;
  setPostCache: (postCache: PostCacheType) => void;
}): Promise<void> {
  let { currentPageIds, postCache, setPostCache } = props;
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

  setPostCache({
    postIds: [...postIds, ...newPostIds],
    postsById: { ...postsById, ...newPostsById },
  });
}

const Index: NextPage<Props> = function Index(props) {
  let { initialPosts, theme } = props;
  let [postCache, setPostCache] = useState(initialPosts);
  let [currentPageIds, setCurrentPageIds] = useState(initialPosts.postIds);
  let defaultTheme = useContext(ThemeContext);

  useEffect(() => {
    let { postIds } = postCache;
    let pageIsFull = currentPageIds.length === POSTS_PER_PAGE;

    if (pageIsFull && !hasNextPage(currentPageIds, postIds)) {
      addPostsToCache({
        currentPageIds,
        postCache,
        setPostCache,
      });
    }
  }, [currentPageIds]);

  return (
    <PostCacheContext.Provider value={postCache}>
      <ThemeContext.Provider value={{ ...defaultTheme, ...theme }}>
        <Layout title={PAGE_TITLE}>
          {currentPageIds.map(id => (
            <PostArticle
              key={id}
              post={postCache.postsById[id]}
              postId={id}
              summary
            />
          ))}

          <Row>
            {hasPrevPage(currentPageIds, postCache.postIds) && (
              <Col xs={4} sm={3} md={2}>
                <Button
                  onClick={(): void => {
                    setPrevPage({
                      postCache,
                      currentPageIds,
                      setCurrentPageIds,
                    });
                  }}
                  block
                >
                  Previous
                </Button>
              </Col>
            )}

            {hasNextPage(currentPageIds, postCache.postIds) && (
              <Col xs={4} sm={3} md={2}>
                <Button
                  onClick={(): void => {
                    setNextPage({
                      postCache,
                      currentPageIds,
                      setCurrentPageIds,
                    });
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

Index.getInitialProps = async function getInitialProps(): Promise<Props> {
  let firestore = firebase.firestore();
  let themesettingsdoc = await firestore.collection('settings').doc('theme').get();
  let theme = themesettingsdoc.data();
  let initialPosts = await getInitialPosts();

  return { theme: { header: theme.header }, initialPosts };
};

export default Index;
