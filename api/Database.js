import { Alert } from "react-native";
import firebase from "./Firebase";

const database = firebase.database();

export default function Database( {action, data, event} ) {
  const uid = firebase.auth().currentUser.uid;

  event = event == undefined ? () => {} : event

  const upload = () => {
    database.ref(uid)
    .set(data)
    .then(() => {
      event == undefined ? () => {} : event
    })
    .catch((error) =>{
      console.log(error);
      Alert.alert(error.Message);
    });
  }

  const download = () => {
    database.ref().child(uid)
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