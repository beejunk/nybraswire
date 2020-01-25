import React, { useContext } from 'react';
import { NextPage } from 'next';
import { Alert } from 'reactstrap';

import Layout from '../../../components/shared/Layout';
import firebase from '../../../firebase';
import PostEditPage from '../../../components/posts/PostEditPage';
import PostEditForm from '../../../components/posts/PostEditForm';
import { getLocalDate, getLocalTime } from '../../../utils/dateUtils';
import usePostEditActions from '../../../hooks/usePostEditActions';
import PostCacheContext from '../../../lib/PostCacheContext';
import {
  FormState,
  PostType,
} from '../../../types/posts';

type Props = {
  post?: PostType;
  postId?: string;
};

// -----------------
// Helper functions.
// -----------------

function validateContent(form: FormState, post?: PostType): boolean {
  let contentHasChanged = post
    ? (form.title !== post.title) || (form.body !== post.body)
    : true;
  let contentIsNotEmpty = (form.title !== '') && (form.body !== '');

  return contentHasChanged && contentIsNotEmpty;
}

function getFormStateFromPost(post: PostType): FormState {
  return {
    title: post.title,
    body: post.body,
    postedOnDate: getLocalDate(post.postedOn),
    postedOnTime: getLocalTime(post.postedOn),
  };
}

// ---------
// Component
// ---------

const Edit: NextPage<Props> = function Edit(props) {
  let { post, postId } = props;
  let activePost = post;

  if (!post) {
    let postCache = useContext(PostCacheContext);
    activePost = postCache.getPost(postId);
  }


  let initialState = {
    alert: { color: 'success', message: '', show: false },
    form: activePost && getFormStateFromPost(activePost),
    preview: false,
  };

  let [postEditState, postActions] = usePostEditActions(initialState);

  return (
    <Layout title="Edit Post">
      <Alert
        isOpen={postEditState.alert.show}
        toggle={(): void => { postActions.updateAlert({ ...postEditState.alert, show: false }); }}
        color={postEditState.alert.color}
      >
        {postEditState.alert.message}
      </Alert>

      {activePost ? (
        <PostEditPage
          form={postEditState.form}
          togglePreview={postActions.togglePreview}
          preview={postEditState.preview}
        >
          <PostEditForm
            form={postEditState.form}
            submit={(): void => { postActions.submit(postEditState.form, activePost, postId); }}
            disableSubmit={!validateContent(postEditState.form, activePost)}
            updateForm={postActions.updateForm}
          />
        </PostEditPage>
      ) : (
        <p>
          {/* TODO: Create proper post-does-not-exist page */}
          Nothing to see here.
        </p>
      )}
    </Layout>
  );
};

Edit.getInitialProps = async (context): Promise<Props> => {
  let { req, query } = context;
  let { postId } = query;

  if (req) {
    let post;

    if (postId) {
      let postRequest = await firebase
        .firestore()
        .collection('posts')
        .doc((postId as string))
        .get();

      if (postRequest.exists) {
        post = postRequest.data();
      }
    }

    return {
      post,
      postId: (postId as string),
    };
  }

  return { postId: (postId as string) };
};

export default Edit;
