import { useEffect } from 'react';
import hljs from 'highlight.js/lib/highlight';
import Layout from '../components/shared/Layout';
import firebase from '../firebase';
import PostArticle from '../components/posts/PostArticle';
import PostEditor from '../components/posts/PostEditor';

const Posts = ({
  title = '',
  body = '',
  edit = false,
  id = '',
}) => {
  useEffect(() => {
    hljs.initHighlighting();

    // NOTE: highlight.js assumes that `initHighlighting` only ever needs to be
    // called once. This is not the case with client-side routing in a Next.js
    // app, where content may be dynamically loaded on a single-page. So we
    // need to set the `called` flag to `false` during component clean-up.

    // TODO: Move this into a more appropriate spot(?)
    return () => {
      hljs.initHighlighting.called = false;
    };
  });

  return (
    <Layout title={title}>
      {edit ? (
        <PostEditor title={title} body={body} id={id} />
      ) : (
        <PostArticle id={id} title={title} body={body} />
      )}
    </Layout>
  );
};

Posts.getInitialProps = async (context) => {
  const { id, edit } = context.query;
  const post = await firebase.firestore().collection('posts').doc(id).get();

  return { ...post.data(), edit, id };
};

export default Posts;
