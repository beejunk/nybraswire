import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';

const Index = ({ posts = [] }) => (
  <Layout>
    <Head>
      <title>Recent Posts</title>
    </Head>

    <h1 css={theme => ({ color: theme.colors.primary })}>
      Recent Posts
    </h1>

    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link as={`/posts/${post.id}`} href={`/posts?id=${post.id}`}>
            <a>{post.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
);

Index.getInitialProps = async (context, fb) => {
  const querySnapshot = await fb.db.collection('posts').get();
  const posts = [];
  querySnapshot.forEach(doc => posts.push({ ...doc.data(), id: doc.id }));

  return { posts };
};

export default Index;
