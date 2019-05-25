import Link from 'next/link';
import { Col, Row } from 'reactstrap';
import Layout from '../components/shared/Layout';
import DateBadge from '../components/shared/DateBadge';
import firebase from '../firebase';

const PAGE_TITLE = 'Recent Posts';

const Index = ({ posts = [] }) => (
  <Layout title={PAGE_TITLE}>
    <Row className="border-bottom mb-3">
      <Col>
        <h1>
          {PAGE_TITLE}
        </h1>
      </Col>
    </Row>

    <Row>
      <Col>
        <ul css={{ listStyleType: 'none' }}>
          {posts.map(post => (
            <li
              key={post.id}
              css={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <DateBadge timestamp={post.postedOn} />
              <Link as={`/posts/${post.id}`} href={`/posts?id=${post.id}`}>
                <a css={{ marginLeft: '1rem' }}>{post.title}</a>
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
