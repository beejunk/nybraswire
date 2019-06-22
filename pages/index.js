// @flow

import React, { useState, useEffect } from 'react';
import { Button, Col, Row } from 'reactstrap';
import Layout from '../components/shared/Layout';
import PostArticle from '../components/posts/PostArticle';
import firebase from '../firebase';

import type { PostCacheType } from '../types/posts';

const PAGE_TITLE = 'Recent Posts';
const POSTS_PER_PAGE = 5;

type Props = {
  addPostsToCache: (posts: PostCacheType) => void,
  firstPage: PostCacheType,
  postCache: PostCacheType,
};

// TODO: Clean up this mess for the love of all that is good.
const getPage = async (
  previous: boolean,
  currentPage?: PostCacheType,
  postCache?: PostCacheType,
  addPostsToCache?: (posts: PostCacheType) => void,
) => {
  const firestore = firebase.firestore();
  const postCollection = firestore.collection('posts');
  const postIds = [];
  const postsById = {};

  let query = postCollection
    .orderBy('postedOn', 'desc')
    .limit(POSTS_PER_PAGE * 2);

  if (currentPage && postCache && addPostsToCache) {
    if (previous) {
      const end = postCache.postIds.indexOf(currentPage.postIds[0]);
      const start = end - POSTS_PER_PAGE;
      const prevPageIds = postCache.postIds.slice(start, end);
      const prevPagePostsById = prevPageIds.reduce((prevPosts, postId) => ({
        ...prevPosts, [postId]: postCache.postsById[postId],
      }), {});

      return { postIds: prevPageIds, postsById: prevPagePostsById };
    }

    const lastPostId = currentPage.postIds[currentPage.postIds.length - 1];
    const lastPostIdx = postCache.postIds.indexOf[lastPostId];

    if (postCache.postIds.length > lastPostIdx + 1) {
      const start = lastPostIdx + 1;
      const end = start + POSTS_PER_PAGE;
      const nextPageIds = postCache.postIds.slice(lastPostIdx + 1, end);
      const nextPagePostsById = nextPageIds.reduce((nextPosts, postId) => ({
        ...nextPosts, [postId]: postCache.postsById[postId],
      }), {});

      return { postIds: nextPageIds, postsById: nextPagePostsById };
    }

    if (postCache) {
      const nextPageIds = postCache.postIds.slice(POSTS_PER_PAGE);
      const nextPagePostsById = nextPageIds.reduce((nextPosts, postId) => ({
        ...nextPosts, [postId]: postCache[postId],
      }), {});

      return { postIds: nextPageIds, postsById: nextPagePostsById };
    }

    const lastDocRef = postCollection.doc(lastPostIdx);
    const lastDocSnapshot = await lastDocRef.get();

    query = query.startAfter(lastDocSnapshot);

    const querySnapshot = await query.get();

    querySnapshot.forEach((doc) => {
      postIds.push(doc.id);
      postsById[doc.id] = doc.data();
    });

    const nextPageIds = postIds.slice(POSTS_PER_PAGE);
    const nextPagePostsById = nextPageIds.reduce((nextPosts, postId) => ({
      ...nextPosts, [postId]: postsById[postId],
    }), {});

    addPostsToCache({ postIds, postsById });

    return { postIds: nextPageIds, postsById: nextPagePostsById };
  }

  const querySnapshot = await query.get();

  querySnapshot.forEach((doc) => {
    postIds.push(doc.id);
    postsById[doc.id] = doc.data();
  });

  return { firstPage: { postIds, postsById } };
};

const getNextPage = getPage.bind(null, false);

const getPrevPage = getPage.bind(null, true);

const onNextButtonClick = (
  currentPage: Props,
  setPage: (nextPage: Props) => void,
) => async () => {
  const nextPage = await getNextPage(currentPage);

  if (nextPage.postIds.length) {
    setPage(nextPage);
  }
};

const onPrevButtonClick = (
  currentPage: Props,
  setPage: (nextPage: Props) => void,
) => async () => {
  const prevPage = await getPrevPage(currentPage);

  setPage(prevPage);
};

const hasNextPage = (currentPageIds: string[], postIds: string[]) => {
  let result = false;

  if (currentPageIds.length) {
    const lastPostId = currentPageIds[currentPageIds.length - 1];

    result = postIds.indexOf(lastPostId) >= postIds.length;
  }

  return result;
};

const Index = ({ addPostsToCache, firstPage, postCache }: Props) => {
  const initialPage = firstPage || getPage(false, undefined, postCache);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    // NOTE: Cache-related actions should only run client-side
    addPostsToCache(page);
  });

  return (
    <Layout title={PAGE_TITLE}>
      {page.postIds.map(id => (
        <PostArticle
          key={id}
          post={page.postsById[id]}
          postId={id}
          summary
        />
      ))}

      <Row>
        {hasNextPage(page.postIds, postCache.postIds) && (
          <Col xs={2}>
            <Button onClick={onPrevButtonClick(page, setPage)} block>
              Previous
            </Button>
          </Col>
        )}

        <Col xs={2}>
          <Button onClick={onNextButtonClick(page, setPage)} block>
            Next
          </Button>
        </Col>
      </Row>
    </Layout>
  );
};

Index.getInitialProps = ({ req }) => req && getNextPage();

export default Index;
