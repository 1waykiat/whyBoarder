import firebase from "./Firebase";
import { Alert } from "react-native";

const auth = firebase.auth();

export default function Authentication( {action, email, password, event } ) {
  const createAccount = async () => {
    await auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account created & signed in!');
      event();
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
      
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      
      console.error(error);
      Alert.alert(error.Message);
      
    });
  };
  
  const signIn = async () => {
    await auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account signed in!');
      event();
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
      
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      
      console.error(error);
      Alert.alert(error.Message);
    });
    
  };
  
  const signOut = async () => {
    await auth
    .signOut()
    .then(() => {
      console.log('User account signed out!');
      event();
    })
    .catch(error => {
      console.error(error);
      Alert.alert(error.Message);
    });
  };

  const forgotPassword = async () => {
    await auth
    .sendPasswordResetEmail(email)
    .then(() => {
      console.log('Password reset email sent!');
      event();
    })
    .catch(error => {     
      console.error(error);
      Alert.alert(error.Message);
    });
  };

  const emailVerification = async () => {
    await auth
    .currentUser.sendEmailVerification()
    .then(() => {
      console.log('Verification email sent!');
      event();
    })
    .catch(error => {
      console.error(error);
      Alert.alert(error.Message);
    });
  };

  const checkVerified = async () => {
    return auth.currentUser.emailVerified ? (event.pass)() : (event.fail)();
  };

  switch (action) {
    case "createAccount": {
       createAccount();
       break;
    };
    case "signIn": {
       signIn();
       break;
    } ;
    case "signOut": {
      signOut();
      break;
    };
    case "forgotPassword": {
      forgotPassword();
      break;
    };
    case "emailVerification": {
      emailVerification();
      break;
    };
    case "checkVerified": {
      checkVerified();
      break;
    }
  }
} 