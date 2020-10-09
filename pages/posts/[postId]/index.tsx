import React, { useState, useContext } from 'react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
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

const getStaticProps: GetStaticProps = async function getStaticProps(context) {
  const { postId } = context.params;

  const postRequest = await firebase
    .firestore()
    .collection('posts')
    .doc(postId)
    .get();

  const post = postRequest.data();

  return {
    props: {
      post,
      postId,
    },
  };
};

const getStaticPaths: GetStaticPaths = async function getStaticPaths() {
  let firestore = firebase.firestore();
  let postCollection = firestore.collection('posts');
  let postIds = [];

  let query = postCollection
    .orderBy('postedOn', 'desc');

  let querySnapshot = await query.get();

  querySnapshot.forEach((doc) => {
    postIds.push(doc.id);
  });

  return {
    paths: postIds.map((postId) => ({ params: { postId } })),
    fallback: false,
  };
};

export default Posts;
export { getStaticProps, getStaticPaths };
