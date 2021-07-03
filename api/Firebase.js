import firebase from "firebase/app";
import "firebase/auth"
import "firebase/database"
import {GOOGLE_API_KEY} from "@env"

const firebaseConfig = {
  apiKey: GOOGLE_API_KEY,
  authDomain: "whyboarder-fc081.firebaseapp.com",
  databaseURL: "https://whyboarder-fc081-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "whyboarder-fc081",
  storageBucket: "whyboarder-fc081.appspot.com",
  messagingSenderId: "548391206823",
  appId: "1:548391206823:web:517d61a42cc09f57148082",
  measurementId: "G-T5HEGL3XG0"
};

const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default firebaseApp;