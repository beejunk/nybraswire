import { useState } from 'react';
import {
  Alert,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
} from 'reactstrap';
import Link from 'next/link';
import Router from 'next/router';
import withAuth from '../shared/withAuth';
import firebase from '../../firebase';

const contentHasChanged = (state, props) => (
  state.title !== props.title
) || (
  state.body !== props.body
);

const submitUpdatedPost = (docId, state, setState) => {
  const { title, body } = state;
  const postRef = firebase.firestore().collection('posts').doc(docId);

  postRef.update({ title, body })
    .then(() => {
      Router.push(`/posts/${docId}`);
    })
    .catch((err) => {
      setState({
        ...state,
        alertColor: 'danger',
        alertMessage: err.message,
        showAlert: true,
      });
    });
};

const PostEditor = ({
  title = '',
  body = '',
  user,
  id = '',
}) => {
  const [state, setState] = useState({
    title,
    body,
    isSubmitting: false,
    showAlert: false,
    alertMessage: '',
    alertColor: 'success',
  });

  return (
    <div className="PostEditor">
      <Alert
        isOpen={state.showAlert}
        toggle={() => setState({ ...state, showAlert: false })}
        color={state.alertColor}
      >
        {state.alertMessage}
      </Alert>

      {user ? (
        <Form>
          <Row>
            <Col sm={6}>
              <FormGroup>
                <Label for="postTitle">Title</Label>
                <Input
                  id="postTitle"
                  name="title"
                  value={state.title}
                  onChange={({ target: { value } }) => {
                    setState({ ...state, title: value });
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
                  id="postBody"
                  type="textarea"
                  name="body"
                  value={state.body}
                  onChange={({ target: { value } }) => {
                    setState({ ...state, body: value });
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          <Button
            onClick={() => { submitUpdatedPost(id, state, setState); }}
            disabled={!contentHasChanged(state, { title, body })}
          >
            Submit
          </Button>
        </Form>
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
};

export default withAuth(PostEditor);
