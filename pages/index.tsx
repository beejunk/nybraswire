import React, { useContext } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { NextPage } from 'next';

import Layout from '../components/shared/Layout';
import PostArticle from '../components/posts/PostArticle';
import PostCacheContext from '../utils/PostCacheContext';

const PAGE_TITLE = 'Recent Posts';

const hasNextPage = (currentPageIds: string[], postIds: string[]): boolean => {
  let result = false;

  if (currentPageIds.length) {
    const lastPostId = currentPageIds[currentPageIds.length - 1];

    result = postIds.indexOf(lastPostId) < postIds.length - 1;
  }

  return result;
};

const hasPrevPage = (currentPageIds: string[], postIds: string[]): boolean => {
  let result = false;

  if (currentPageIds.length) {
    const firstPostId = currentPageIds[0];

    result = postIds.indexOf(firstPostId) > 0;
  }

  return result;
};

const Index: NextPage = () => {
  const postCache = useContext(PostCacheContext);

  return (
    <Layout title={PAGE_TITLE}>
      {postCache.currentPageIds.map(id => (
        <PostArticle
          key={id}
          post={postCache.postsById[id]}
          postId={id}
          summary
        />
      ))}

      <Row>
        {hasPrevPage(postCache.currentPageIds, postCache.postIds) && (
          <Col xs={4} sm={3} md={2}>
            <Button onClick={postCache.getPrevPage} block>
              Previous
            </Button>
          </Col>
        )}

        {hasNextPage(postCache.currentPageIds, postCache.postIds) && (
          <Col xs={4} sm={3} md={2}>
            <Button onClick={postCache.getNextPage} block>
              Next
            </Button>
          </Col>
        )}
      </Row>
    </Layout>
  );
};

export default Index;
