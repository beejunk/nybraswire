import Router from 'next/router';
import { useReducer, useEffect } from 'react';
import { Alert } from 'reactstrap';
import Layout from '../components/shared/Layout';
import firebase from '../firebase';
import PostEdit from '../components/posts/PostEdit';
import PostArticle from '../components/posts/PostArticle';
import PostEditForm from '../components/posts/PostEditForm';

const UPDATE_ALERT = 'UPDATE_ALERT';
const UPDATE_TITLE = 'UPDATE_TITLE';
const UPDATE_BODY = 'UPDATE_BODY';
const SHOW_ALERT = 'SHOW_ALERT';
const TOGGLE_PREVIEW = 'TOGGLE_PREVIEW';
const SET_SHOULD_CLEAR_FORM = 'SET_SHOULD_CLEAR_FORM';

const generateActions = dispatch => ({
  showAlert(alertShouldShow) {
    dispatch({
      type: SHOW_ALERT,
      showAlert: alertShouldShow,
    });
  },

  updateAlert({ color, message }) {
    dispatch({
      type: UPDATE_ALERT,
      alertMessage: message,
      alertColor: color,
    });
  },

  togglePreview() {
    dispatch({ type: TOGGLE_PREVIEW });
  },

  updateBody(body) {
    dispatch({ type: UPDATE_BODY, body });
  },

  updateTitle(title) {
    dispatch({ type: UPDATE_TITLE, title });
  },

  setShouldClearForm(shouldClearForm) {
    dispatch({ type: SET_SHOULD_CLEAR_FORM, shouldClearForm });
  },

  submitPost(docId, title, body) {
    const firestore = firebase.firestore();
    const data = { title, body };
    const ref = docId
      ? firestore.collection('posts').doc(docId)
      : firestore.collection('posts');
    const request = docId ? ref.update(data) : ref.add(data);

    request
      .then((docRef) => {
        Router.push(`/posts/${docId || docRef.id}`);
      })
      .catch((err) => {
        this.updateAlert({
          color: 'danger',
          message: err.message,
        });

        this.showAlert(true);
      });
  },
});

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
    case SET_SHOULD_CLEAR_FORM:
      return { ...state, shouldClearForm: action.shouldClearForm };
    default:
      return state;
  }
};

const contentHasChanged = (state, title, body) => (
  state.title !== title || state.body !== body
);

const Posts = ({
  title = '',
  body = '',
  edit = false,
  id = '',
  create = false,
}) => {
  const initialState = {
    alertColor: 'success',
    alertMessage: '',
    isSubmitting: false,
    shouldClearForm: true,
    showAlert: false,
    preview: false,
    title,
    body,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = generateActions(dispatch);

  useEffect(() => {
    if (create && state.shouldClearForm) {
      // If already viewing a post when navigating to the create page, then the
      // title and body need to be cleared or else the form will get populated
      // with the post data.
      actions.updateTitle('');
      actions.updateBody('');
      actions.setShouldClearForm(false);
    } else if (!create && !state.shouldClearForm) {
      // When navigating away from the create page to any other 'posts' page,
      // mark the form as needing to be cleared.
      actions.setShouldClearForm(true);
    }
  });

  return (
    <Layout title={title}>
      <Alert
        isOpen={state.showAlert}
        toggle={() => { actions.showAlert(false); }}
        color={state.alertColor}
      >
        {state.alertMessage}
      </Alert>

      {edit || create ? (
        <PostEdit
          title={state.title}
          body={state.body}
          togglePreview={actions.togglePreview}
          preview={state.preview}
        >
          <PostEditForm
            docId={id}
            body={state.body}
            title={state.title}
            submitPost={() => { actions.submitPost(id, state.title, state.body); }}
            disableSubmit={!contentHasChanged(state, title, body)}
            updateBody={actions.updateBody}
            updateTitle={actions.updateTitle}
          />
        </PostEdit>
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
  const { id, edit, create } = context.query;
  let data = {};

  if (id) {
    const post = await firebase.firestore().collection('posts').doc(id).get();
    data = post.data();
  }

  return {
    ...data,
    create,
    edit,
    id,
  };
};

export default Posts;
