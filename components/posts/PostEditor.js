import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
} from 'reactstrap';
import Link from 'next/link';
import withAuth from '../shared/withAuth';

const PostEditor = ({ title = '', body = '', user }) => (
  <div className="PostEditor">
    {user ? (
      <Form>
        <Row>
          <Col sm={6}>
            <FormGroup>
              <Label for="postTitle">Title</Label>
              <Input id="postTitle" name="title" placeholder={title} />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormGroup>
              <Label for="postBody">Body</Label>
              <Input id="postBody" type="textarea" name="body" placeholder={body} />
            </FormGroup>
          </Col>
        </Row>

        <Button>
          Submit
        </Button>
      </Form>
    ) : (
      <p>
        Please
        {' '}
        <Link href="/login">log in</Link>
        {' '}
        to edit posts
      </p>
    )}
  </div>
);

export default withAuth(PostEditor);
