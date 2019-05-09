import { Col, Button, Row } from 'reactstrap';
import Link from 'next/link';
import withAuth from '../shared/withAuth';
import PostArticle from './PostArticle';
import PostEditForm from './postEdit/PostEditForm';

const PostEdit = ({
  title = '',
  body = '',
  user,
  id = '',
  preview = false,
  dispatch,
  actionCreators,
  disableSubmit,
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
          <PostEditForm
            body={body}
            dispatch={dispatch}
            actionCreators={actionCreators}
            docId={id}
            title={title}
            disableSubmit={disableSubmit}
          />
        )}

        <Row>
          <Col xs={6} sm={3}>
            <Button
              block
              color="info"
              onClick={() => { dispatch(actionCreators.togglePreview()); }}
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
