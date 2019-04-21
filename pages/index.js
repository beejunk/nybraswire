import Link from 'next/link';
import { Col, Row } from 'reactstrap';
import Layout from '../components/shared/Layout';
import firebase from '../firebase';

const PAGE_TITLE = 'Recent Posts';

const Index = ({ posts = [] }) => (
  <Layout title={PAGE_TITLE}>
    <Row>
      <Col>
        <h1>
          {PAGE_TITLE}
        </h1>
      </Col>
    </Row>

    <Row>
      <Col>
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <Link as={`/posts/${post.id}`} href={`/posts?id=${post.id}`}>
                <a>{post.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </Col>
    </Row>
  </Layout>
);

Index.getInitialProps = async () => {
  const querySnapshot = await firebase.firestore().collection('posts').get();
  const posts = [];
  querySnapshot.forEach(doc => posts.push({ ...doc.data(), id: doc.id }));

  return { posts };
};

export default Index;
