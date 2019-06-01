import Link from 'next/link';
import { Col, Row } from 'reactstrap';
import Layout from '../components/shared/Layout';
import DateBadge from '../components/shared/DateBadge';
import firebase from '../firebase';

const PAGE_TITLE = 'Recent Posts';

const Index = ({ posts = [] }) => (
  <Layout title={PAGE_TITLE}>
    <Row>
      <Col>
        <ul css={{ listStyleType: 'none' }}>
          {posts.map(post => (
            <li
              key={post.id}
              css={{
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <DateBadge timestamp={post.postedOn} />

              <h2 css={{ marginLeft: '1rem' }}>
                <Link as={`/posts/${post.id}`} href={`/posts?id=${post.id}`}>
                  <a>{post.title}</a>
                </Link>
              </h2>
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
