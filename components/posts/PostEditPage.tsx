import React from 'react';
import { Col, Button, Row } from 'reactstrap';
import Link from 'next/link';
import PostArticle from './PostArticle';
import useAuth from '../../hooks/useAuth';

import { FormState, PostType } from '../../types/posts';

type Props = {
  form: FormState | PostType;
  preview: boolean;
  togglePreview: (boolean) => void;
  children: React.ReactNode;
};

const PostEditPage: React.FC<Props> = ({
  form,
  preview,
  togglePreview,
  children,
}: Props) => {
  const user = useAuth();

  return (
    <div className="PostEditPage">
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
};

export default PostEditPage;
