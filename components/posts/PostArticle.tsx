import React, { useEffect } from 'react';
import Link from 'next/link';
import hljs from 'highlight.js/lib/highlight';
import { Col, Row } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import useAuth from '../../hooks/useAuth';
import DateBadge from '../shared/DateBadge';

import { FormState, PostType } from '../../types/posts';

const ROUTE = '/posts';

type Props = {
  post: PostType | FormState;
  postId?: string;
  editLink?: boolean;
  summary?: boolean;
};

const appendEllipses = (body: string): string => {
  if (body.endsWith('.')) {
    return body;
  }

  const lastSpace = body.lastIndexOf(' ');

  return `${body.slice(0, lastSpace)} ...`;
};

const getSummary = (body: string, maxLength = 600): string => {
  if (body.length > maxLength) {
    const truncatedBody = body.slice(0, maxLength);
    return appendEllipses(truncatedBody);
  }

  return body;
};

const PostArticle: React.FC<Props> = (props) => {
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
    return (): void => {
      hljs.initHighlighting.called = false;
    };
  }, []);

  const user = useAuth();
  const body = summary ? getSummary(post.body) : post.body;

  return (
    <article className="PostArticle">
      <Row className="border-bottom mb-3 align-items-center">
        <Col xs={12} sm={10} className="mb-3" css={{ display: 'flex', alignItems: 'center' }}>
          <DateBadge timestamp={(post as PostType).postedOn || Date.now()} />

          {postId && summary ? (
            <h2 className="ml-3">
              <Link href={`${ROUTE}/[postId]`} as={`${ROUTE}/${postId}`}>
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
          <Col xs={12} sm={2} className="text-right">
            <Link href={`${ROUTE}/[postId]/edit`} as={`${ROUTE}/${postId}/edit`}>
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

      {summary && postId && (
        <Row>
          <Col className="text-right">
            <Link href={`${ROUTE}/[postId]`} as={`${ROUTE}/${postId}`}>
              <a><small>Read more &gt;</small></a>
            </Link>
          </Col>
        </Row>
      )}
    </article>
  );
};

PostArticle.defaultProps = {
  postId: undefined,
  editLink: false,
  summary: false,
};

export default PostArticle;
