// @flow

import React from 'react';
import { Col, Button, Row } from 'reactstrap';
import Link from 'next/link';
import withAuth from '../shared/withAuth';
import PostArticle from './PostArticle';

import type { PostType } from '../../types/posts';

type Props = {
  form: PostType,
  user: any,
  preview: boolean,
  togglePreview: (boolean) => void,
  children: any,
};

const PostEdit = ({
  form,
  user,
  preview,
  togglePreview,
  children,
}: Props) => (
  <div className="PostEdit">
    {user ? (
      <>
        {preview ? (
          <PostArticle
            post={form}
            editLink={false}
          />
        ) : (
          children
        )}

        <Row>
          <Col xs={6} sm={3}>
            <Button
              block
              color="info"
              onClick={togglePreview}
            >
              { preview ? 'Edit' : 'Preview' }
            </Button>
          </Col>
        </Row>
      </>
    ) : (
      <p>
        Please
        {' '}
        <Link href="/login"><a>log in</a></Link>
        {' '}
        to edit posts
      </p>
    )}
  </div>
);

export default withAuth(PostEdit);
