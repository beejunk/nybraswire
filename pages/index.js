// @flow

import React from 'react';
import Layout from '../components/shared/Layout';
import PostArticle from '../components/posts/PostArticle';
import firebase from '../firebase';

import type { PostType } from '../types/posts';

const PAGE_TITLE = 'Recent Posts';

type Props = {
  posts: Array<{ data: PostType, id: string}>
};

const Index = (props: Props) => {
  const { posts } = props;

  return (
    <Layout title={PAGE_TITLE}>
      {posts.map(post => (
        <PostArticle
          key={post.id}
          post={post.data}
          postId={post.id}
          summary
        />
      ))}
    </Layout>
  );
};

Index.getInitialProps = async () => {
  const querySnapshot = await firebase.firestore().collection('posts').get();
  const posts = [];

  querySnapshot.forEach(doc => posts.push({ data: doc.data(), id: doc.id }));

  return { posts };
};

export default Index;
