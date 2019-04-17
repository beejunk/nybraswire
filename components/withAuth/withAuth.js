import { useEffect, useState } from 'react';
import firebase from '../../firebase';

const withAuth = (WrappedComponent) => {
  const AuthContainer = (props) => {
    const [user, setUser] = useState();

    useEffect(() => {
      firebase.auth().onAuthStateChanged((loggedInUser) => {
        if (loggedInUser) {
          setUser(loggedInUser);
        } else {
          setUser();
        }
      });
    });

    return <WrappedComponent {...props} user={user} />;
  };

  return AuthContainer;
};

export default withAuth;
