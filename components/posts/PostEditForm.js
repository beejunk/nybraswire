import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

const PostEditForm = ({
  title,
  body,
  docId,
  disableSubmit = false,
  updateTitle,
  updateBody,
  submitPost,
}) => (
  <Form className="mb-3">
    <Row>
      <Col sm={6}>
        <FormGroup>
          <Label for="postTitle">Title</Label>
          <Input
            id="postTitle"
            name="title"
            value={title}
            onChange={({ target: { value } }) => {
              updateTitle(value);
            }}
          />
        </FormGroup>
      </Col>
    </Row>

    <Row>
      <Col>
        <FormGroup>
          <Label for="postBody">Body</Label>
          <Input
            css={{
              minHeight: '15rem',
            }}
            id="postBody"
            type="textarea"
            name="body"
            value={body}
            onChange={({ target: { value } }) => {
              updateBody(value);
            }}
          />
        </FormGroup>
      </Col>
    </Row>

    <Row>
      <Col xs={6} sm={3}>
        <Button
          block
          onClick={() => {
            submitPost(docId, title, body);
          }}
          disabled={disableSubmit}
        >
          Submit

        </Button>
      </Col>
    </Row>
  </Form>
);

export default PostEditForm;
