import { useReducer } from 'react';
import { Alert } from 'reactstrap';
import Layout from '../components/shared/Layout';
import firebase from '../firebase';
import PostArticle from '../components/posts/PostArticle';
import PostEdit from '../components/posts/PostEdit';

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

const Posts = ({
  title = '',
  body = '',
  edit = false,
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
    <Layout title={title}>
      <Alert
        isOpen={state.showAlert}
        toggle={() => { dispatch(actionCreators.showAlert(false)); }}
        color={state.alertColor}
      >
        {state.alertMessage}
      </Alert>

      {edit ? (
        <PostEdit
          title={state.title}
          body={state.body}
          id={id}
          dispatch={dispatch}
          actionCreators={actionCreators}
          preview={state.preview}
          disableSubmit={contentHasChanged(state, title, body)}
        />
      ) : (
        <PostArticle
          id={id}
          title={title}
          body={body}
        />
      )}
    </Layout>
  );
};

Posts.getInitialProps = async (context) => {
  const { id, edit } = context.query;
  const post = await firebase.firestore().collection('posts').doc(id).get();

  return { ...post.data(), edit, id };
};

export default Posts;
