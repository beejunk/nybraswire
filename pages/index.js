// @flow

import React, { useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import Layout from '../components/shared/Layout';
import PostArticle from '../components/posts/PostArticle';
import firebase from '../firebase';

import type { PostType } from '../types/posts';

const PAGE_TITLE = 'Recent Posts';
const POSTS_PER_PAGE = 5;

type Props = {
  postIds: Array<string>,
  postsById: { [id: string]: PostType },
  pageIndex: number,
};

const getPage = async (previous: boolean, currentPage?: Props) => {
  const firestore = firebase.firestore();
  const postCollection = firestore.collection('posts');
  const postIds = [];
  const postsById = {};
  let pageIndex = currentPage ? currentPage.pageIndex : 0;

  let query = postCollection
    .orderBy('postedOn', 'desc')
    .limit(POSTS_PER_PAGE);

  // TODO: Clean up this mess.
  if (currentPage) {
    if (previous && pageIndex > 0) {
      const firstDocRef = postCollection.doc(currentPage.postIds[0]);
      const firstDocSnapshot = await firstDocRef.get();

      query = query.endBefore(firstDocSnapshot);
      pageIndex -= 1;
    } else {
      const lastPageIdx = currentPage.postIds[currentPage.postIds.length - 1];
      const lastDocRef = postCollection.doc(lastPageIdx);
      const lastDocSnapshot = await lastDocRef.get();

      query = query.startAfter(lastDocSnapshot);
      pageIndex += 1;
    }

    const querySnapshot = await query.get();

    querySnapshot.forEach((doc) => {
      postIds.push(doc.id);
      postsById[doc.id] = doc.data();
    });
  } else {
    const querySnapshot = await query.get();

    querySnapshot.forEach((doc) => {
      postIds.push(doc.id);
      postsById[doc.id] = doc.data();
    });
  }

  return { postIds, postsById, pageIndex };
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

const Index = ({ postIds, postsById, pageIndex }: Props) => {
  const [page, setPage] = useState({ postIds, postsById, pageIndex });

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
        {page.pageIndex > 0 && (
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

Index.getInitialProps = () => getNextPage();

export default Index;
