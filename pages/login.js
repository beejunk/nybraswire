// @flow

import React from 'react';
import { Col, Row } from 'reactstrap';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import Layout from '../components/shared/Layout';
import firebase from '../firebase';
import useAuth from '../hooks/useAuth';

const uiConfig = {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callBacks: {
    signInSuccessWithAuthResult: () => false,
  },
  credentialHelper: 'none',
};

const Login = () => {
  const user = useAuth();

  return (
    <Layout title="Login">
      <Row className="Login">
        {user ? (
          <Col>
            <p>
              {/* TODO: Make nicer already-logged-in page */}
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
};

export default Login;
