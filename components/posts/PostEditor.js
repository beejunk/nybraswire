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
import ReactMarkdown from 'react-markdown';
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
    alertColor: 'success',
    alertMessage: '',
    body,
    isSubmitting: false,
    showAlert: false,
    preview: false,
    title,
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
        <>
          {state.preview && (
            <>
              <Row className="border-bottom mb-3 align-items-center">
                <Col>
                  <h1>{title}</h1>
                </Col>
              </Row>

              <Row className="border-bottom mb-3 align-items-center">
                <Col>
                  <ReactMarkdown source={state.body} />
                </Col>
              </Row>
            </>
          )}

          <Form>
            {!state.preview && (
              <>
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
                        css={{
                          minHeight: '15rem',
                        }}
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
              </>
            )}

            <Row>
              <Col xs={6} sm={3}>
                <Button
                  block
                  onClick={() => { submitUpdatedPost(id, state, setState); }}
                  disabled={!contentHasChanged(state, { title, body })}
                >
                  Submit
                </Button>
              </Col>

              <Col xs={6} sm={3}>
                <Button
                  block
                  color="info"
                  onClick={() => { setState({ ...state, preview: !state.preview }); }}
                >
                  { state.preview ? 'Edit' : 'Preview' }
                </Button>
              </Col>
            </Row>
          </Form>
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
};

export default withAuth(PostEditor);
