// @flow

import React from 'react';
import { Button, Col, Row } from 'reactstrap';
import Layout from '../components/shared/Layout';
import PostArticle from '../components/posts/PostArticle';

import type { PostCacheType } from '../types/posts';

const PAGE_TITLE = 'Recent Posts';

type Props = {
  currentPageIds: string[],
  getNextPage: () => void,
  getPrevPage: () => void,
  postCache: PostCacheType,
};

const hasNextPage = (currentPageIds: string[], postIds: string[]) => {
  let result = false;

  if (currentPageIds.length) {
    const lastPostId = currentPageIds[currentPageIds.length - 1];

    result = postIds.indexOf(lastPostId) < postIds.length - 1;
  }

  return result;
};

const hasPrevPage = (currentPageIds: string[], postIds: string[]) => {
  let result = false;

  if (currentPageIds.length) {
    const firstPostId = currentPageIds[0];

    result = postIds.indexOf(firstPostId) > 0;
  }

  return result;
};

const Index = ({
  currentPageIds,
  getNextPage,
  getPrevPage,
  postCache,
}: Props) => (
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
        <Col xs={2}>
          <Button onClick={getPrevPage} block>
            Previous
          </Button>
        </Col>
      )}

      {hasNextPage(currentPageIds, postCache.postIds) && (
        <Col xs={2}>
          <Button onClick={getNextPage} block>
            Next
          </Button>
        </Col>
      )}
    </Row>
  </Layout>
);

export default Index;
