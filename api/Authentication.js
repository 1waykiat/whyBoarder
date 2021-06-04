import "firebase/auth"; 
import firebase from "firebase/app";

export default function Authentication( {action, email, password, event } ) {
  const createAccount = async () => {
    await firebase.auth()
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
    });
  };
  
  const signIn = async () => {
    await firebase.auth()
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
    });
    
  };
  
  const signOut = async () => {
    await firebase.auth()
    .signOut()
    .then(() => {
      console.log('User account signed out!');
      event();
    })
    .catch(error => {
      console.error(error);
    });
  };

  const forgotPassword = async () => {
    await firebase.auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      console.log('Password reset email sent!');
      event();
    })
    .catch(error => {     
      console.error(error);
    });
  };

  const emailVerification = async () => {
    await firebase.auth()
    .currentUser.sendEmailVerification()
    .then(() => {
      console.log('Verification email sent!');
      event();
    })
    .catch(error => {
      console.error(error);
    });
  };

  const checkVerified = async () => {
    return firebase.auth().currentUser.emailVerified ? (event.pass)() : (event.fail)();
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