import ReactMarkdown from 'react-markdown';
import Layout from '../components/shared/Layout';
import firebase from '../firebase';

const Posts = ({ title = '', body = '' }) => (
  <Layout title={title}>
    <article>
      <h1>{title}</h1>

      <ReactMarkdown source={body} />
    </article>
  </Layout>
);

Posts.getInitialProps = async (context) => {
  const { id } = context.query;
  const post = await firebase.firestore().collection('posts').doc(id).get();

  return post.data();
};

export default Posts;
