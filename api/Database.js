import { Alert } from "react-native";
import firebase from "./Firebase";
import { getDatabase, ref, set, child, get } from "firebase/database"
import { getAuth } from "firebase/auth"

const database = getDatabase(firebase);
const auth = getAuth(firebase)

export default function Database( {action, slice, data, event = {pass: () => {}, fail:() => {}}} ) {
  const uid = auth.currentUser.uid;
  const route = uid +"/" + slice;

  const upload = () => {
    set(ref(database, route), data)
    .then(() => {
      event()
    })
    .catch((error) => {
      console.log(error);
      Alert.alert(error.message);
    });
  }

  const download = () => {
    get(child(ref(database), route))
    .then((item) => {
      if (item.exists()) {
        (event.pass)()(item);
      } else {
        (event.fail)();
      }
    })
    .catch((error) => {
      console.log(error);
      Alert.alert(error.message);
    });
  }

  switch (action) {
    case "upload": {
      upload();
      break;
    };
    case "download": {
      download();
      break;
    };
  }
}