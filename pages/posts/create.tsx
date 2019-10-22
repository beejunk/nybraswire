import React from 'react';
import { NextPage } from 'next';
import { Alert } from 'reactstrap';

import Layout from '../../components/shared/Layout';
import firebase from '../../firebase';
import PostEditPage from '../../components/posts/PostEditPage';
import PostEditForm from '../../components/posts/PostEditForm';
import { getLocalDate, getLocalTime } from '../../utils/dateUtils';
import usePostEditActions from '../../hooks/usePostEditActions';

import {
  FormState,
  PostType,
} from '../../types/posts';

type Props = {
  post?: PostType;
  postId?: string;
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

const Create: NextPage<Props> = (props) => {
  const {
    post,
    postId,
  } = props;
  const initialState = {
    alert: { color: 'success', message: '', show: false },
    form: getDefaultFormState(),
    preview: false,
  };

  const [postEditState, postActions] = usePostEditActions(initialState);

  return (
    <Layout title="Edit Post">
      <Alert
        isOpen={postEditState.alert.show}
        toggle={(): void => { postActions.updateAlert({ ...postEditState.alert, show: false }); }}
        color={postEditState.alert.color}
      >
        {postEditState.alert.message}
      </Alert>

      {post ? (
        <PostEditPage
          form={postEditState.form}
          togglePreview={postActions.togglePreview}
          preview={postEditState.preview}
        >
          <PostEditForm
            form={postEditState.form}
            submit={(): void => { postActions.submit(postEditState.form, post, postId); }}
            disableSubmit={!validateContent(postEditState.form, post)}
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

Create.getInitialProps = async (context): Promise<Props> => {
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

export default Create;
