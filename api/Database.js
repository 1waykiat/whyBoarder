import { Alert } from "react-native";
import firebase from "./Firebase";

const database = firebase.database();

export default function Database( {action, slice, data, event = () => {}} ) {
  const uid = firebase.auth().currentUser.uid;
  const route = uid +"/" + slice;

  const upload = () => {
    database.ref(route)
    .set(data)
    .then(() => {
      event()
    })
    .catch((error) =>{
      console.log(error);
      Alert.alert(error.Message);
    });
  }

  const download = () => {
    database.ref().child(route)
    .get()
    .then((item) => {
      if (item.exists()) {
        event()(item);
      }
    })
    .catch((error) => {
      console.log(error);
      Alert.alert(error.Message);
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