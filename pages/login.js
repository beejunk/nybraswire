import { Col, Row } from 'reactstrap';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import withAuth from '../components/shared/withAuth';
import Layout from '../components/shared/Layout';
import firebase from '../firebase';

const uiConfig = {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callBacks: {
    signInSuccessWithAuthResult: () => false,
  },
  credentialHelper: 'none',
};

const Login = ({ user }) => (
  <Layout>
    <Row className="Login">
      {user ? (
        <Col>
          <p>
            Already logged in with
            {' '}
            {user.email}
          </p>
        </Col>
      ) : (
        <Col>
          <FirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </Col>
      )}
    </Row>
  </Layout>
);

export default withAuth(Login);
