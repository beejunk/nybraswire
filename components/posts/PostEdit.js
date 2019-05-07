import { useReducer } from 'react';
import {
  Alert,
  Col,
  Button,
  Row,
} from 'reactstrap';
import Link from 'next/link';
import withAuth from '../shared/withAuth';
import PostArticle from './PostArticle';
import PostEditForm from './postEdit/PostEditForm';

// TODO: Move state logic into top-level post component.

const UPDATE_ALERT = 'UPDATE_ALERT';
const UPDATE_TITLE = 'UPDATE_TITLE';
const UPDATE_BODY = 'UPDATE_BODY';
const SHOW_ALERT = 'SHOW_ALERT';
const TOGGLE_PREVIEW = 'TOGGLE_PREVIEW';

const actionCreators = {
  showAlert(alertShouldShow) {
    return {
      type: SHOW_ALERT,
      showAlert: alertShouldShow,
    };
  },

  updateAlert({ color, message }) {
    return {
      type: UPDATE_ALERT,
      alertMessage: message,
      alertColor: color,
    };
  },

  togglePreview() {
    return { type: TOGGLE_PREVIEW };
  },

  updateBody(body) {
    return { type: UPDATE_BODY, body };
  },

  updateTitle(title) {
    return { type: UPDATE_TITLE, title };
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_TITLE:
      return { ...state, title: action.title };
    case UPDATE_BODY:
      return { ...state, body: action.body };
    case UPDATE_ALERT:
      return {
        ...state,
        alertMessage: action.alertMessage,
        alertColor: action.alertColor,
      };
    case SHOW_ALERT:
      return { ...state, showAlert: action.showAlert };
    case TOGGLE_PREVIEW:
      return { ...state, preview: !state.preview };
    default:
      return state;
  }
};

const contentHasChanged = (state, title, body) => (
  state.title !== title
) || (
  state.body !== body
);

const PostEdit = ({
  title = '',
  body = '',
  user,
  id = '',
}) => {
  const initialState = {
    alertColor: 'success',
    alertMessage: '',
    body,
    isSubmitting: false,
    showAlert: false,
    preview: false,
    title,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="PostEdit">
      <Alert
        isOpen={state.showAlert}
        toggle={() => { dispatch(actionCreators.showAlert(false)); }}
        color={state.alertColor}
      >
        {state.alertMessage}
      </Alert>

      {user ? (
        <>
          {state.preview ? (
            <PostArticle
              title={state.title}
              body={state.body}
              editLink={false}
            />
          ) : (
            <PostEditForm
              body={state.body}
              dispatch={dispatch}
              actionCreators={actionCreators}
              docId={id}
              title={state.title}
              disableSubmit={!contentHasChanged(state, title, body)}
            />
          )}

          <Row>
            <Col xs={6} sm={3}>
              <Button
                block
                color="info"
                onClick={() => { dispatch(actionCreators.togglePreview()); }}
              >
                { state.preview ? 'Edit' : 'Preview' }
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
};

export default withAuth(PostEdit);
