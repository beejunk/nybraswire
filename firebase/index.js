import firebase from 'firebase/app';
import 'firebase/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp(process.env.firebase);
}

const app = firebase.app();

export default {
  db: app.firestore(),
};
