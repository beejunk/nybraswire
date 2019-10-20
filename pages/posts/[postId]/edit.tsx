import React, { useReducer, useEffect } from 'react';
import Router from 'next/router';
import { NextPage } from 'next';
import { Alert } from 'reactstrap';

import Layout from '../../../components/shared/Layout';
import firebase from '../../../firebase';
import PostEditPage from '../../../components/posts/PostEditPage';
import PostEditForm from '../../../components/posts/PostEditForm';
import { getLocalDate, getLocalTime } from '../../../utils/dateUtils';

import {
  AlertState,
  FormState,
  PostType,
} from '../../../types/posts';

// ---------
// Constants
// ---------

const UPDATE_ALERT = 'UPDATE_ALERT';
const UPDATE_FORM = 'UPDATE_FORM';
const TOGGLE_PREVIEW = 'TOGGLE_PREVIEW';
const SET_SHOULD_CLEAR_FORM = 'SET_SHOULD_CLEAR_FORM';

// -------------------------
// Action and dispatch types
// -------------------------

type UpdateAlertAction = { type: 'UPDATE_ALERT'; alert: AlertState };
type UpdateFormAction = { type: 'UPDATE_FORM'; form: FormState };
type TogglePreviewAction = { type: 'TOGGLE_PREVIEW' };
type SetShouldClearFormAction = { type: 'SET_SHOULD_CLEAR_FORM'; shouldClearForm: boolean };

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
  post?: PostType;
  postId?: string;
};

export type State = {
  alert: AlertState;
  form: FormState;
  shouldClearForm: boolean;
  preview: boolean;
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

interface PostActionsAPI {
  updateAlert(alert: AlertState): void;
  updateForm(form: FormState): void;
  togglePreview(): void;
  setShouldClearForm(shouldClearForm: boolean): void;
  createPost(form: FormState): Promise<void>;
  updatePost(form: FormState, post: PostType, postId: string): Promise<void>;
  submit(form: FormState, post?: PostType, postId?: string): void;
}

const generateActions = (dispatch: Dispatch): PostActionsAPI => ({
  updateAlert(alert: AlertState): void {
    dispatch(updateAlert(alert));
  },

  updateForm(form: FormState): void {
    dispatch(updateForm(form));
  },

  togglePreview(): void {
    dispatch(togglePreview());
  },

  setShouldClearForm(shouldClearForm: boolean): void {
    dispatch(setShouldClearForm(shouldClearForm));
  },

  async createPost(form: FormState): Promise<void> {
    const firestore = firebase.firestore();
    const ref = firestore.collection('posts');
    const postedOn = new Date(`${form.postedOnDate}T${form.postedOnTime}`).getTime();
    const post: PostType = {
      title: form.title,
      body: form.body,
      createdOn: postedOn,
      updatedOn: postedOn,
      postedOn,
      published: true, // TODO: Implement `published` field.
    };
    const request = ref.add(post);

    try {
      const docRef = await request;
      Router.push(`/posts/${docRef.id}`);
    } catch (err) {
      const message = `There was a problem creating your post: ${err.message}`;
      this.updateAlert({ color: 'danger', message, show: true });
    }
  },

  async updatePost(form: FormState, post: PostType, postId: string): Promise<void> {
    const firestore = firebase.firestore();
    const ref = firestore.collection('posts').doc(postId);
    const postedOn = new Date(`${form.postedOnDate}T${form.postedOnTime}`).getTime();
    const updatedPost = { ...post };

    updatedPost.updatedOn = Date.now();

    if (post.postedOn !== postedOn) {
      updatedPost.postedOn = postedOn;
    }

    if (post.title !== form.title) {
      updatedPost.title = form.title;
    }

    if (post.body !== form.body) {
      updatedPost.body = form.body;
    }

    const request = await ref.update(updatedPost);

    try {
      await request;
      Router.push(`/posts/${postId}`);
    } catch (err) {
      const message = `There was a problem updating your post: ${err.message}`;
      this.updateAlert({ color: 'danger', message, show: true });
    }
  },

  submit(form: FormState, post?: PostType, postId?: string): void {
    if (post && postId) {
      this.updatePost(form, post, postId);
    } else {
      this.createPost(form);
    }
  },
});

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

// -----------------
// Helper functions.
// -----------------

const validateContent = (form: FormState, post?: PostType): boolean => {
  const contentHasChanged = post
    ? (form.title !== post.title) || (form.body !== post.body)
    : true;
  const contentIsNotEmpty = (form.title !== '') && (form.body !== '');

  return contentHasChanged && contentIsNotEmpty;
};

const getFormStateFromPost = (post: PostType): FormState => ({
  title: post.title,
  body: post.body,
  postedOnDate: getLocalDate(post.postedOn),
  postedOnTime: getLocalTime(post.postedOn),
});

const getDefaultFormState = (): FormState => {
  const now = Date.now();

  return {
    title: '',
    body: '',
    postedOnDate: getLocalDate(now),
    postedOnTime: getLocalTime(now),
  };
};

// ---------
// Component
// ---------

const Posts: NextPage<Props> = (props) => {
  const {
    post,
    postId,
  } = props;
  const initialState: State = {
    alert: { color: 'success', message: '', show: false },
    form: post
      ? getFormStateFromPost(post)
      : getDefaultFormState(),
    shouldClearForm: true,
    preview: false,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const postActions = generateActions(dispatch);

  return (
    <Layout title="Edit Post">
      <Alert
        isOpen={state.alert.show}
        toggle={(): void => { postActions.updateAlert({ ...state.alert, show: false }); }}
        color={state.alert.color}
      >
        {state.alert.message}
      </Alert>

      {post ? (
        <PostEditPage
          form={state.form}
          togglePreview={postActions.togglePreview}
          preview={state.preview}
        >
          <PostEditForm
            form={state.form}
            submit={(): void => { postActions.submit(state.form, post, postId); }}
            disableSubmit={!validateContent(state.form, post)}
            updateForm={postActions.updateForm}
          />
        </PostEditPage>
      ) : (
        <p>
          {/* TODO: Create proper post-does-not-exist page */}
          What are you trying to do?
        </p>
      )}
    </Layout>
  );
};

Posts.defaultProps = { post: undefined, postId: undefined };

Posts.getInitialProps = async (context): Promise<Props> => {
  const { req, query } = context;
  const { postId } = query;
  let post;

  if (postId && req) {
    const postRequest = await firebase
      .firestore()
      .collection('posts')
      .doc((postId as string))
      .get();

    if (postRequest.exists) {
      post = { ...postRequest.data() };
    }
  }

  return {
    post,
    postId: (postId as string),
  };
};

export default Posts;
