import ReactMarkdown from 'react-markdown';
import Layout from '../components/shared/Layout';
import firebase from '../firebase';
import PostEditor from '../components/posts/PostEditor';

const Posts = ({ title = '', body = '', edit = false }) => (
  <Layout title={title}>
    {edit ? (
      <PostEditor title={title} body={body} />
    ) : (
      <article>
        <h1>{title}</h1>

        <ReactMarkdown source={body} />
      </article>
    )}
  </Layout>
);

Posts.getInitialProps = async (context) => {
  const { id, edit } = context.query;
  const post = await firebase.firestore().collection('posts').doc(id).get();

  return { ...post.data(), edit };
};

export default Posts;
