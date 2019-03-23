import Head from 'next/head';
import Layout from '../components/Layout';

const Posts = ({ title = '', body = '' }) => (
  <Layout>
    <article>
      <Head>
        <title>{title}</title>
      </Head>

      <h1>{title}</h1>

      <p>
        {body}
      </p>
    </article>
  </Layout>
);

Posts.getInitialProps = async (context, fb) => {
  const { id } = context.query;
  const post = await fb.db.collection('posts').doc(id).get();

  return post.data();
};

export default Posts;
