import "firebase/auth"; 
import firebase from "firebase/app";


export const connect = (event) => {
  firebase.auth().onAuthStateChanged(event);
}

export const createAccount =  async (email, password) => {
  await firebase.auth()
  .createUserWithEmailAndPassword(email, password)
  .then(() => {
    console.log('User account created & signed in!');
    return true;
  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }

    console.error(error);
    return false;
  });
};

export const signIn = async (email, password) => {
  await firebase.auth()
  .signInWithEmailAndPassword(email, password)
  .then(() => {
    console.log('User account signed in!');
    return true;
  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }
    
    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }
    
    console.error(error);
    return false;
  });

};

export const signOut = async () => {
  await firebase.auth()
  .signOut()
  .then(() => {
    console.log('User account signed out!');
    return true;
  })
  .catch(error => {
    console.error(error);
    return false;
  });
}