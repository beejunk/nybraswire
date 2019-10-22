import { useReducer } from 'react';
import Router from 'next/router';

import firebase from '../firebase';
import { FormState, PostType, AlertState } from '../types/posts';

// ---------
// Constants
// ---------

const UPDATE_ALERT = 'UPDATE_ALERT';
const UPDATE_FORM = 'UPDATE_FORM';
const TOGGLE_PREVIEW = 'TOGGLE_PREVIEW';

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

export type PostEditState = {
  alert: AlertState;
  form: FormState;
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

interface PostActionsAPI {
  updateAlert(alert: AlertState): void;
  updateForm(form: FormState): void;
  togglePreview(): void;
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

const reducer = (state: PostEditState, action: Action): PostEditState => {
  switch (action.type) {
    case UPDATE_ALERT:
      return { ...state, alert: { ...action.alert } };
    case UPDATE_FORM:
      return { ...state, form: { ...action.form } };
    case TOGGLE_PREVIEW:
      return { ...state, preview: !state.preview };
    default:
      return state;
  }
};

const usePostEditActions = (initialState: PostEditState): [
  PostEditState,
  PostActionsAPI,
 ] => {
  const [postEditState, dispatch] = useReducer(reducer, initialState);
  const postActions = generateActions(dispatch);


  return [postEditState, postActions];
};

export default usePostEditActions;
