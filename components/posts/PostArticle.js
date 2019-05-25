// @flow

import React, { useEffect } from 'react';
import Link from 'next/link';
import hljs from 'highlight.js/lib/highlight';
import { Col, Row } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import useAuth from '../../hooks/useAuth';

import type { FormState, PostType } from '../../types/posts';

const ROUTE = '/posts';

type Props = {
  post: PostType | FormState,
  postId?: string,
  editLink: boolean,
};

const PostArticle = (props: Props) => {
  const {
    post,
    postId,
    editLink = true,
  } = props;

  useEffect(() => {
    hljs.initHighlighting();

    // NOTE: highlight.js assumes that `initHighlighting` only ever needs to be
    // called once. This is not the case with client-side routing in a Next.js
    // app, where content may be dynamically loaded on a single-page. So we
    // need to set the `called` flag to `false` during component clean-up.
    return () => {
      hljs.initHighlighting.called = false;
    };
  });

  const user = useAuth();

  const postedOnStr = post.postedOn && typeof post.postedOn === 'number'
    ? new Date(post.postedOn).toDateString()
    : '';

  return (
    <article className="PostArticle">
      <Row className="border-bottom mb-3 align-items-center">
        <Col>
          <h1>{post.title}</h1>
        </Col>

        {user && editLink && postId && (
          <Col xs={3} className="text-right">
            <Link as={`${ROUTE}/${postId}/edit`} href={`/${ROUTE}?id=${postId}&edit=true`}>
              <a>
                Edit
              </a>
            </Link>
          </Col>
        )}
      </Row>

      {postedOnStr && (
        <Row>
          <Col>
            <p>
              <small>{postedOnStr}</small>
            </p>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <ReactMarkdown source={post.body} />
        </Col>
      </Row>
    </article>
  );
};

PostArticle.defaultProps = { postId: undefined };

export default PostArticle;
