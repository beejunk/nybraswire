import { Col, Button, Row } from 'reactstrap';
import Link from 'next/link';
import withAuth from '../shared/withAuth';
import PostArticle from './PostArticle';

const PostEdit = ({
  title = '',
  body = '',
  user,
  preview = false,
  togglePreview,
  children,
}) => (
  <div className="PostEdit">
    {user ? (
      <>
        {preview ? (
          <PostArticle
            title={title}
            body={body}
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
