// @flow

import { useEffect, useState } from 'react';
import firebase from '../firebase';

const useAuth = (): firebase.User | null => {
  const [user, setUser] = useState(null);

  // Immediately return the function provided by `onAuthStateChanged` so that
  // all listeners are unsubscribed on component teardown.
  useEffect(() => firebase.auth().onAuthStateChanged((loggedInUser) => {
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      setUser(null);
    }
  }), []);

  return user;
};

export default useAuth;
