import Link from 'next/link';
import { Col, Row } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import withAuth from '../shared/withAuth';

const ROUTE = '/posts';

const PostArticle = ({
  title = '',
  body = '',
  id = '',
  user,
}) => (
  <article className="PostArticle">
    <Row className="border-bottom mb-3 align-items-center">
      <Col>
        <h1>{title}</h1>
      </Col>

      {user && (
        <Col xs={3} className="text-right">
          <Link as={`${ROUTE}/${id}/edit`} href={`/${ROUTE}?id=${id}&edit=true`}>
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

export default withAuth(PostArticle);
