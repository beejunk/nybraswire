import React, { useContext, useState } from 'react';
import { NextPage } from 'next';
import { Alert } from 'reactstrap';

import Layout from '../../../components/shared/Layout';
import firebase from '../../../firebase';
import PostArticle from '../../../components/posts/PostArticle';
import PostCacheContext from '../../../utils/PostCacheContext';

import {
  AlertState,
  PostType,
} from '../../../types/posts';

type Props = {
  post?: PostType;
  postId: string;
};

// ---------
// Component
// ---------

const Posts: NextPage<Props> = (props) => {
  const {
    post,
    postId,
  } = props;

  const postCache = useContext(PostCacheContext);
  const activePost = post || postCache.postsById[postId];
  const title = activePost ? activePost.title : 'No Post Found';
  const initialAlertState: AlertState = {
    color: 'success',
    message: '',
    show: false,
  };

  const [alert, setAlert] = useState(initialAlertState);

  return (
    <Layout title={title}>
      <Alert
        isOpen={alert.show}
        toggle={(): void => { setAlert({ ...alert, show: false }); }}
        color={alert.color}
      >
        {alert.message}
      </Alert>

      {activePost ? (
        <PostArticle post={activePost} postId={postId} editLink />
      ) : (
        <p>
          {/* TODO: Create proper post-does-not-exist page */}
          Post does not exist
        </p>
      )}
    </Layout>
  );
};

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
