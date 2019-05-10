import { useEffect, useState } from 'react';
import firebase from '../../../firebase';

const withAuth = (WrappedComponent) => {
  const AuthContainer = (props) => {
    const [user, setUser] = useState();

    // Immediately return the function provided by `onAuthStateChanged` so that
    // all listeners are unsubscribed on component teardown.
    useEffect(() => firebase.auth().onAuthStateChanged((loggedInUser) => {
      if (loggedInUser) {
        setUser(loggedInUser);
      } else {
        setUser();
      }
    }));

    return <WrappedComponent {...props} user={user} />;
  };

  return AuthContainer;
};

export default withAuth;
