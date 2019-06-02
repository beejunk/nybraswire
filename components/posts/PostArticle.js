// @flow

import React, { useEffect } from 'react';
import Link from 'next/link';
import hljs from 'highlight.js/lib/highlight';
import { Col, Row } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import useAuth from '../../hooks/useAuth';
import DateBadge from '../shared/DateBadge';

import type { FormState, PostType } from '../../types/posts';

const ROUTE = '/posts';

type Props = {
  post: PostType | FormState,
  postId?: string,
  editLink?: boolean,
  summary?: boolean
};

const getSummary = (body: string, maxLength: number = 200) => {
  // Set summary to be the first paragraph;
  let summary = body.split('\n')[0];

  if (summary.length > maxLength) {
    // Truncate summary if it is too long.
    summary = summary.slice(0, maxLength);

    // Remove any incomplete words and add an elipses.
    summary = `${summary.slice(0, summary.lastIndexOf(' '))} ...`;
  }

  return summary;
};

const PostArticle = (props: Props) => {
  const {
    post,
    postId,
    editLink = true,
    summary,
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

  const body = summary ? getSummary(post.body) : post.body;

  return (
    <article className="PostArticle">
      <Row className="border-bottom mb-3 align-items-center">
        <Col className="mb-3" css={{ display: 'flex', alignItems: 'center' }}>
          <DateBadge timestamp={post.postedOn || Date.now()} />

          {postId && summary ? (
            <h2 className="ml-3">
              <Link as={`/posts/${postId}`} href={`/posts?id=${postId}`}>
                <a>{post.title}</a>
              </Link>
            </h2>
          ) : (
            <h1 className="ml-3">
              {post.title}
            </h1>
          )}
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

      <Row>
        <Col>
          <ReactMarkdown source={body} />
        </Col>
      </Row>
    </article>
  );
};

PostArticle.defaultProps = {
  postId: undefined,
  editLink: false,
  summary: false,
};

export default PostArticle;
