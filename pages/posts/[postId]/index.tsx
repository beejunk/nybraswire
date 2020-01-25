import React, { useState, useContext } from 'react';
import { NextPage } from 'next';
import { Alert } from 'reactstrap';

import PostCacheContext from '../../../lib/PostCacheContext';
import Layout from '../../../components/shared/Layout';
import firebase from '../../../firebase';
import PostArticle from '../../../components/posts/PostArticle';

import {
  AlertState,
  PostType,
} from '../../../types/posts';

type Props = {
  post?: PostType;
  postId: string;
};

const Posts: NextPage<Props> = function Posts(props) {
  let { post, postId } = props;

  if (!post) {
    let postCache = useContext(PostCacheContext);
    post = postCache.getPost(postId);
  }

  let title = post ? post.title : 'No Post Found';
  let initialAlertState: AlertState = {
    color: 'success',
    message: '',
    show: false,
  };

  let [alert, setAlert] = useState(initialAlertState);

  return (
    <Layout title={title}>
      <Alert
        isOpen={alert.show}
        toggle={(): void => { setAlert({ ...alert, show: false }); }}
        color={alert.color}
      >
        {alert.message}
      </Alert>

      {post ? (
        <PostArticle post={post} postId={postId} editLink />
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

  if (req) {
    let post;

    if (postId) {
      const postRequest = await firebase
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

export default Posts;
