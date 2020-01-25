import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { NextPage } from 'next';

import firebase from '../firebase';
import Layout from '../components/shared/Layout';
import PostArticle from '../components/posts/PostArticle';
import PostCacheContext from '../lib/PostCacheContext';
import ThemeContext from '../theme';
import { PostCacheType } from '../types/posts';
import { PostCacheAPI } from '../lib/postCache';

type State = { currentPageIds: string[] };
type ThemeSettings = { header: string };

const PAGE_TITLE = 'Recent Posts';
const POSTS_PER_PAGE = 5;

/**
 * Retrieve the initial set of posts. If a `postCache` object is provided, then
 * the fetched posts will be added to the cache.
 */
async function getInitialPosts(props: {
  postCache?: PostCacheAPI;
  setCurrentPageIds?: (ids: string[]) => void;
 } = {}): Promise<PostCacheType> {
  let { postCache, setCurrentPageIds } = props;
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

  // Add posts to cache and set the current page IDs. This will only ever run
  // client-side.
  if (postCache) {
    postIds.forEach((postId) => {
      postCache.addPost(postsById[postId], postId);
    });
  }

  if (setCurrentPageIds) {
    setCurrentPageIds(postIds);
  }

  return { postIds, postsById };
}

/**
 * Indicates if there is a next page of posts.
 */
function hasNextPage(props: {
  currentPageIds: string[];
  postCache: PostCacheAPI;
}): boolean {
  let { currentPageIds, postCache } = props;
  let { postIds } = postCache.getCache();

  if (currentPageIds.length) {
    let lastPostId = currentPageIds[currentPageIds.length - 1];

    return postIds.indexOf(lastPostId) < postIds.length - 1;
  }

  return false;
}

/**
 * Indicates if there is a previous page of posts.
 */
function hasPrevPage(props: {
  currentPageIds: string[];
  postCache: PostCacheAPI;
}): boolean {
  let { currentPageIds, postCache } = props;
  let { postIds } = postCache.getCache();

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
  currentPageIds: string[];
  setCurrentPageIds: (postIds: string[]) => void;
  postCache: PostCacheAPI;
}): void {
  let { currentPageIds, setCurrentPageIds, postCache } = props;
  let { postIds } = postCache.getCache();
  let firstPostIndex = postIds.indexOf(currentPageIds[0]);
  let prevPageIds = postIds.slice(firstPostIndex - POSTS_PER_PAGE, firstPostIndex);

  setCurrentPageIds(prevPageIds);
}

/**
 * Set the current page to the next page.
 */
function setNextPage(props: {
  currentPageIds: string[];
  setCurrentPageIds: (postIds: string[]) => void;
  postCache: PostCacheAPI;
}): void {
  let { currentPageIds, setCurrentPageIds, postCache } = props;
  let { postIds } = postCache.getCache();
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
  postCache: PostCacheAPI;
}): Promise<void> {
  let { currentPageIds, postCache } = props;
  let firestore = firebase.firestore();
  let postCollection = firestore.collection('posts');
  let lastPostId = currentPageIds[currentPageIds.length - 1];
  let lastDocRef = postCollection.doc(lastPostId);

  let lastDocSnapshot = await lastDocRef.get();

  let query = postCollection
    .orderBy('postedOn', 'desc')
    .limit(POSTS_PER_PAGE)
    .startAfter(lastDocSnapshot);

  let querySnapshot = await query.get();

  querySnapshot.forEach((doc) => {
    let data = doc.data();
    let post = {
      title: data.title,
      body: data.body,
      createdOn: data.createdOn,
      updatedOn: data.updatedOn,
      postedOn: data.postedOn,
      published: data.published,
    };

    postCache.addPost(post, doc.id);
  });
}

const Index: NextPage<PostCacheType> = function Index(props) {
  let { postIds, postsById } = props;
  let defaultTheme = useContext(ThemeContext);
  let postCache = useContext(PostCacheContext);

  if (postIds.length) {
    // Add initial posts to cache if this was server-rendered
    postIds.forEach((id) => {
      postCache.addPost(postsById[id], id);
    });
  }

  let cachedIds = postCache.getCache().postIds;
  let [currentPageIds, setCurrentPageIds] = useState(cachedIds);

  useEffect(() => {
    let pageIsFull = currentPageIds.length === POSTS_PER_PAGE;

    if (!currentPageIds.length) {
      getInitialPosts({ postCache, setCurrentPageIds });
    } else if (pageIsFull && !hasNextPage({ currentPageIds, postCache })) {
      // TODO: Maybe add a flag that indicates we've reach the end of the page
      // if no new posts get added?
      addPostsToCache({ currentPageIds, postCache });
    }
  }, [currentPageIds]);

  return (
    <PostCacheContext.Provider value={postCache}>
      <ThemeContext.Provider value={defaultTheme}>
        <Layout title={PAGE_TITLE}>
          {currentPageIds.map((id) => (
            <PostArticle
              key={id}
              post={postCache.getCache().postsById[id]}
              postId={id}
              summary
            />
          ))}

          <Row>
            {hasPrevPage({ currentPageIds, postCache }) && (
              <Col xs={4} sm={3} md={2}>
                <Button
                  onClick={(): void => {
                    setPrevPage({ currentPageIds, setCurrentPageIds, postCache });
                  }}
                  block
                >
                  Previous
                </Button>
              </Col>
            )}

            {hasNextPage({ currentPageIds, postCache }) && (
              <Col xs={4} sm={3} md={2}>
                <Button
                  onClick={(): void => {
                    setNextPage({ currentPageIds, setCurrentPageIds, postCache });
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

Index.getInitialProps = async function getInitialProps(context): Promise<PostCacheType> {
  let { req } = context;
  let initialPosts = { postIds: [], postsById: {} };

  if (req) {
    initialPosts = await getInitialPosts();
  }

  return initialPosts;
};

export default Index;
