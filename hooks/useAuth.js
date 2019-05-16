// @flow

import { useEffect, useState } from 'react';
import firebase from '../firebase';

const useAuth = () => {
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

  return user;
};

export default useAuth;
