import Router from 'next/router';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import firebase from '../../../firebase';

const submitUpdatedPost = (
  docId,
  title,
  body,
  dispatch,
  actionCreators,
) => {
  const postRef = firebase.firestore().collection('posts').doc(docId);

  postRef.update({ title, body })
    .then(() => {
      Router.push(`/posts/${docId}`);
    })
    .catch((err) => {
      dispatch(actionCreators.updateAlert({
        alertColor: 'danger',
        alertMessage: err.message,
      }));

      dispatch(actionCreators.showAlert(true));
    });
};


const PostEditForm = ({
  title,
  body,
  docId,
  dispatch,
  actionCreators,
  disableSubmit = true,
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
              dispatch(actionCreators.updateTitle(value));
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
              dispatch(actionCreators.updateBody(value));
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
            submitUpdatedPost(docId, title, body, dispatch, actionCreators);
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
