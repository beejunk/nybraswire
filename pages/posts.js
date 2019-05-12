// @flow

import React, { useReducer, useEffect } from 'react';
import Router from 'next/router';
import { Alert } from 'reactstrap';
import Layout from '../components/shared/Layout';
import firebase from '../firebase';
import PostEdit from '../components/posts/PostEdit';
import PostArticle from '../components/posts/PostArticle';
import PostEditForm from '../components/posts/PostEditForm';

import type { AlertState, PostType } from '../types/posts';

// ---------
// Constants
// ---------

export const UPDATE_ALERT = 'UPDATE_ALERT';
export const UPDATE_FORM = 'UPDATE_FORM';
export const TOGGLE_PREVIEW = 'TOGGLE_PREVIEW';
export const SET_SHOULD_CLEAR_FORM = 'SET_SHOULD_CLEAR_FORM';

// -------------------------
// Action and dispatch types
// -------------------------

type UpdateAlertAction = { type: 'UPDATE_ALERT', alert: AlertState };
type UpdateFormAction = { type: 'UPDATE_FORM', form: PostType };
type TogglePreviewAction = { type: 'TOGGLE_PREVIEW' };
type SetShouldClearFormAction = { type: 'SET_SHOULD_CLEAR_FORM', shouldClearForm: boolean };

type Action =
  | UpdateAlertAction
  | UpdateFormAction
  | TogglePreviewAction
  | SetShouldClearFormAction;

type Dispatch = (action: Action) => void;

// --------------------------------
// Component props and state types.
// --------------------------------

export type Props = {
  +post: PostType,
  +edit: boolean,
  +id: string,
  +create: boolean,
};


export type State = {
  +alert: AlertState,
  +form: PostType,
  +shouldClearForm: boolean,
  +preview: boolean,
};


// ---------------
// Action creators
// ---------------

const updateAlert = (alert: AlertState): UpdateAlertAction => ({
  type: UPDATE_ALERT,
  alert,
});

const updateForm = (form: PostType): UpdateFormAction => ({
  type: UPDATE_FORM,
  form,
});

const togglePreview = (): TogglePreviewAction => ({
  type: TOGGLE_PREVIEW,
});

const setShouldClearForm = (shouldClearForm: boolean): SetShouldClearFormAction => ({
  type: SET_SHOULD_CLEAR_FORM,
  shouldClearForm,
});

/**
 * Generate actions using the given dispatch function.
 */
const generateActions = (dispatch: Dispatch) => ({
  updateAlert(alert: AlertState) {
    dispatch(updateAlert(alert));
  },

  updateForm(form: PostType) {
    dispatch(updateForm(form));
  },

  togglePreview() {
    dispatch(togglePreview());
  },

  setShouldClearForm(shouldClearForm: boolean) {
    dispatch(setShouldClearForm(shouldClearForm));
  },

  submitPost(docId: string, post: PostType) {
    const firestore = firebase.firestore();
    const ref = docId
      ? firestore.collection('posts').doc(docId)
      : firestore.collection('posts');
    const request = docId ? ref.update(post) : ref.add(post);

    request
      .then((docRef) => {
        Router.push(`/posts/${docId || docRef.id}`);
      })
      .catch(({ message }) => {
        this.updateAlert({ color: 'danger', message, show: true });
      });
  },
});

/**
 * State reducer.
 */
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case UPDATE_ALERT:
      return { ...state, alert: { ...action.alert } };
    case UPDATE_FORM:
      return { ...state, form: { ...action.form } };
    case TOGGLE_PREVIEW:
      return { ...state, preview: !state.preview };
    case SET_SHOULD_CLEAR_FORM:
      return { ...state, shouldClearForm: action.shouldClearForm };
    default:
      return state;
  }
};

/**
 * Given the form state and the original document data, will return `true` if the
 * content has changed, `false` otherwise.
 */
const contentHasChanged = (form: PostType, post: PostType) => (
  form.title !== post.title || form.body !== post.body
);

/**
 * Container component that manages the all operations related to posts.
 */
const Posts = (props: Props) => {
  const {
    post,
    edit,
    id,
    create,
  } = props;

  const initialState: State = {
    alert: { color: 'success', message: '', show: false },
    form: { ...post },
    shouldClearForm: true,
    preview: false,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = generateActions(dispatch);

  useEffect(() => {
    if (create && state.shouldClearForm) {
      // If already viewing a post when navigating to the create page, then the
      // title and body need to be cleared or else the form will get populated
      // with the post data.
      actions.updateForm({ title: '', body: '' });
      actions.setShouldClearForm(false);
    } else if (!create && !state.shouldClearForm) {
      // When navigating away from the create page to any other 'posts' page,
      // mark the form as needing to be cleared.
      actions.setShouldClearForm(true);
    }
  });

  return (
    <Layout title={post.title}>
      <Alert
        isOpen={state.alert.show}
        toggle={() => { actions.updateAlert({ ...state.alert, show: false }); }}
        color={state.alert.color}
      >
        {state.alert.message}
      </Alert>

      {edit || create ? (
        <PostEdit
          form={state.form}
          togglePreview={actions.togglePreview}
          preview={state.preview}
        >
          <PostEditForm
            docId={id}
            form={state.form}
            submitPost={() => { actions.submitPost(id, state.form); }}
            disableSubmit={!contentHasChanged(state.form, post)}
            updateForm={actions.updateForm}
          />
        </PostEdit>
      ) : (
        <PostArticle
          id={id}
          post={post}
        />
      )}
    </Layout>
  );
};

Posts.getInitialProps = async (context) => {
  const { id, edit, create } = context.query;
  let post = {};

  if (id) {
    const postRequest = await firebase.firestore().collection('posts').doc(id).get();
    post = postRequest.data();
  }

  return {
    post,
    create,
    edit,
    id,
  };
};

export default Posts;
