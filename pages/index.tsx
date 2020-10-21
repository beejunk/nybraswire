import React, { useContext } from 'react';
import { NextPage, GetStaticProps } from 'next';

import firebase from '../firebase';
import Layout from '../components/shared/Layout';
import PostArticle from '../components/posts/PostArticle';
import ThemeContext from '../theme/context';
import { PostCacheType } from '../types/posts';

const PAGE_TITLE = 'Recent Posts';

const Index: NextPage<PostCacheType> = function Index(props) {
  let { postIds, postsById } = props;
  let defaultTheme = useContext(ThemeContext);

  return (
    <ThemeContext.Provider value={defaultTheme}>
      <Layout title={PAGE_TITLE}>
        {postIds.map((id) => (
          <PostArticle
            key={id}
            post={postsById[id]}
            postId={id}
            summary
          />
        ))}
      </Layout>
    </ThemeContext.Provider>
  );
};

export const getStaticProps: GetStaticProps = async function getStaticProps() {
  let firestore = firebase.firestore();
  let postCollection = firestore.collection('posts');
  let query = postCollection.orderBy('postedOn', 'desc');
  let currentPostIds = [];
  let currentPostsById = {};

  let querySnapshot = await query.get();

  querySnapshot.forEach((doc) => {
    currentPostIds.push(doc.id);
    currentPostsById[doc.id] = doc.data();
  });

  return {
    props: { postIds: currentPostIds, postsById: currentPostsById },
    revalidate: 900,
  };
};

export default Index;
