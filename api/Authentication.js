import "firebase/auth"; 
import firebase from "firebase/app";

export default function Authentication( {action, email, password, navigation } ) {
  const createAccount = async (email, password) => {
    await firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account created & signed in!');
      navigation.navigate("WorkList");
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
      
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      
      console.error(error);
    });
  };
  
  const signIn = async (email, password) => {
    await firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account signed in!');
      navigation.navigate("WorkList");
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
      
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      
      console.error(error);
    });
    
  };
  
  const signOut = async () => {
    await firebase.auth()
    .signOut()
    .then(() => {
      console.log('User account signed out!');
      navigation.navigate("Home");
    })
    .catch(error => {
      console.error(error);
    });
  }

  switch (action) {
    case "createAccount": {
       createAccount(email, password);
       break;
    }
    case "signIn": {
       signIn(email, password);
       break;
    } 
    case "signOut": {
      signOut();
      break;
    }
  }
} 