// @flow

import React, { useEffect } from 'react';
import Link from 'next/link';
import hljs from 'highlight.js/lib/highlight';
import { Col, Row } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import useAuth from '../../hooks/useAuth';

import type { PostType } from '../../types/posts';

const ROUTE = '/posts';

type Props = {
  post: PostType,
  editLink: boolean,
};

/**
 * Renders a post.
 */
const PostArticle = (props: Props) => {
  const {
    post,
    editLink = true,
  } = props;

  const user = useAuth();

  useEffect(() => {
    hljs.initHighlighting();

    // NOTE: highlight.js assumes that `initHighlighting` only ever needs to be
    // called once. This is not the case with client-side routing in a Next.js
    // app, where content may be dynamically loaded on a single-page. So we
    // need to set the `called` flag to `false` during component clean-up.

    // TODO: Move this into a more appropriate spot(?)
    return () => {
      hljs.initHighlighting.called = false;
    };
  });

  return (
    <article className="PostArticle">
      <Row className="border-bottom mb-3 align-items-center">
        <Col>
          <h1>{post.title}</h1>
        </Col>

        {user && editLink && (
          <Col xs={3} className="text-right">
            <Link as={`${ROUTE}/${post.id}/edit`} href={`/${ROUTE}?id=${post.id}&edit=true`}>
              <a>
                Edit
              </a>
            </Link>
          </Col>
        )}
      </Row>

      <Row>
        <Col>
          <ReactMarkdown source={post.body} />
        </Col>
      </Row>
    </article>
  );
};

export default PostArticle;
