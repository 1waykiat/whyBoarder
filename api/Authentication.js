import firebase  from "./Firebase";
import { Alert } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth"

const auth = getAuth(firebase);

export default function Authentication( {action, email, password, event } ) {
  event = event == undefined ? () => {} : event

  const createAccount = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
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
      
      Alert.alert(error.message);
      
    });
  };
  
  const emailSignIn = async () => {
    await signInWithEmailAndPassword(auth, email, password)
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
      
      Alert.alert(error.message);
    });
  };
  
  const googleSignIn = async () => {
    try {
      GoogleSignin.configure();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User account signed in!');
      event(userInfo.user.id);
    } catch(error) {
        Alert.alert(error.message);
    }
  };

  const signOut_ = async () => {
    await signOut(auth)
    .then(() => {
      console.log('User account signed out!');
      event();
    })
    .catch(error => {
      Alert.alert(error.message);
    });
  };

  const forgotPassword = async () => {
    await sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log('Password reset email sent!');
      event();
    })
    .catch(error => {
      Alert.alert(error.message);
    });
  };

  const emailVerification = async () => {
    await sendEmailVerification(auth.currentUser)
    .then(() => {
      console.log('Verification email sent!');
      event();
    })
    .catch(error => {
      Alert.alert(error.message);
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
    case "emailSignIn": {
       emailSignIn();
       break;
    } ;
    case "signOut": {
      signOut_();
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
    case "googleSignIn": {
      googleSignIn();
      break;
    }
  }
} 