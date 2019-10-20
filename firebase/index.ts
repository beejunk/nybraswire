import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = process.env.firebase;

// TODO: Is there a better way to make flow happy?
if (!firebase.apps.length && config && typeof config === 'object') {
  firebase.initializeApp(config);
}

export default firebase;
