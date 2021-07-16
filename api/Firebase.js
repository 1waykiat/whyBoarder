import firebase from "firebase/app";
import "firebase/auth"
import "firebase/database"
import {apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, measurementId} from "@env"

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export let provider = new firebase.auth.GoogleAuthProvider();

export default firebaseApp;