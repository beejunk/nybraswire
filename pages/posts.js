// @flow

import React, { useReducer, useEffect } from 'react';
import Router from 'next/router';
import { Alert } from 'reactstrap';
import Layout from '../components/shared/Layout';
import firebase from '../firebase';
import PostEdit from '../components/posts/PostEdit';
import PostArticle from '../components/posts/PostArticle';
import PostEditForm from '../components/posts/PostEditForm';

import type { AlertState, FormState, PostType } from '../types/posts';

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
type UpdateFormAction = { type: 'UPDATE_FORM', form: FormState };
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
  post: ?PostType,
  +edit: boolean,
  +create: boolean,
};


export type State = {
  +alert: AlertState,
  +form: FormState,
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

const updateForm = (form: FormState): UpdateFormAction => ({
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

  updateForm(form: FormState) {
    dispatch(updateForm(form));
  },

  togglePreview() {
    dispatch(togglePreview());
  },

  setShouldClearForm(shouldClearForm: boolean) {
    dispatch(setShouldClearForm(shouldClearForm));
  },

  async submitPost(form: FormState, post: ?PostType) {
    const firestore = firebase.firestore();
    const ref = post
      ? firestore.collection('posts').doc(post.id)
      : firestore.collection('posts');
    const request = post
      ? ref.update({ ...post, ...form })
      // TODO: Add timestamps to new documents
      : ref.add(form);

    try {
      const docRef = await request;
      Router.push(`/posts/${post ? post.id : docRef.id}`);
    } catch (err) {
      const message = `There was a problem submitting your post: ${err.message}`;
      this.updateAlert({ color: 'danger', message, show: true });
    }
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
 * Given the form state and the original document data, will return `true` if
 * the content has changed and is not empty, `false` otherwise.
 */
const validateContent = (form: FormState, post: ?PostType) => {
  const contentHasChanged = post
    ? (form.title !== post.title) || (form.body !== post.body)
    : true;
  const contentIsNotEmpty = (form.title !== '') && (form.body !== '');

  return contentHasChanged && contentIsNotEmpty;
};

/**
 * Container component that manages all operations related to posts.
 */
const Posts = (props: Props) => {
  const {
    post,
    edit,
    create,
  } = props;

  const initialState: State = {
    alert: { color: 'success', message: '', show: false },
    form: post
      ? { title: post.title, body: post.body, postedOn: post.postedOn }
      : { title: '', body: '', postedOn: Date.now() },
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
      actions.updateForm({ title: '', body: '', postedOn: Date.now() });
      actions.setShouldClearForm(false);
    } else if (!create && !state.shouldClearForm) {
      // When navigating away from the create page to any other 'posts' page,
      // mark the form as needing to be cleared.
      actions.setShouldClearForm(true);
    }
  });

  // TODO: Create 'Post does not exist page'.

  return (
    <Layout title={post && !edit ? post.title : 'Create/Edit Post'}>
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
            form={state.form}
            submitPost={() => { actions.submitPost(state.form, post); }}
            disableSubmit={!validateContent(state.form, post)}
            updateForm={actions.updateForm}
          />
        </PostEdit>
      ) : (
        <>
          {post ? (
            <PostArticle id={post.id} post={post} />
          ) : (
            <p>Post does not exist</p>
          )}
        </>
      )}
    </Layout>
  );
};

Posts.getInitialProps = async (context) => {
  const { id, edit, create } = context.query;
  let post;

  if (id) {
    const postRequest = await firebase.firestore().collection('posts').doc(id).get();

    if (postRequest.exists) {
      post = { id, ...postRequest.data() };
    }
  }

  return {
    post,
    create,
    edit,
  };
};

export default Posts;
