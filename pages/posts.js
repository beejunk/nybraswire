import Layout from '../components/shared/Layout';
import firebase from '../firebase';
import PostArticle from '../components/posts/PostArticle';
import PostEdit from '../components/posts/PostEdit';

const Posts = ({
  title = '',
  body = '',
  edit = false,
  id = '',
}) => (
  <Layout title={title}>
    {edit ? (
      <PostEdit title={title} body={body} id={id} />
    ) : (
      <PostArticle id={id} title={title} body={body} />
    )}
  </Layout>
);

Posts.getInitialProps = async (context) => {
  const { id, edit } = context.query;
  const post = await firebase.firestore().collection('posts').doc(id).get();

  return { ...post.data(), edit, id };
};

export default Posts;
