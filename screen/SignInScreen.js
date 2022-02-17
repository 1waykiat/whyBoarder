import React, {useState} from 'react'
import { Text, Button, TextInput } from 'react-native-paper'
import { View, StyleSheet, Image, Pressable, Alert } from 'react-native'

import colors from '../presentational/colors';

import { useDispatch } from 'react-redux';
import { cleanupAgenda, downloadTodo, updateRecurring } from "../slice/todoListSlice";
import { downloadSettings } from "../slice/settingsSlice";

import Authentication from '../api/Authentication';
import Database from '../api/Database';
import { today } from '../api/Time';

export default function SignInScreen( { navigation } ) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleEmailUpdate = (text) => setEmail(text);
  const handlePasswordUpdate = (text) => setPassword(text);

  const dispatch = useDispatch();

  const signInPass = () => {
    // pull and update todoList slice from Firebase
    Database( { action: "download", slice: "todoList", event: {
      pass: () => (data) => {
        const item = data.val();
        const formattedItem = {
          ...item,
          fixList: Array.from(item.fixList == undefined ? {} : item.fixList),
          flexList: Array.from(item.flexList == undefined ? {} : item.flexList),
          agenda: cleanupAgenda(item.agenda), 
        }
        dispatch(downloadTodo(formattedItem));
      },
      fail: () => {},
    }} );
    // pull and update settings slice from Firebase
    Database( {action: "download", slice: "settings", event: {
      pass: () => (data) => {
        const item = data.val();
        dispatch(downloadSettings(item));
      },
      fail: () => {},
    }} );
    
    Database( {action: "download", slice: "updateDate", event: {
      pass: () => (data) => {
        const item = data.val();
        dispatch(updateRecurring(item));
      },
      fail: () => Database( {action: "upload", slice: "updateDate", data: today(), event: () => {}} ),
    }} );

    navigation.navigate("WorkList");
  }

  const emailSignIn = () => Authentication( {action: "emailSignIn", email, password, event: () => {
    Authentication( {action: "checkVerified", event: {
      pass: signInPass,
      fail: () => Authentication( {
        action: "emailVerification", event: () => {
          Alert.alert("Verification email has been resent to " + email);
        }
      })
    }} );
    setPassword('')
  } });

  return(
  <View style={styles.container}>
    <Image style={styles.image} source={require('../assets/logo.png')} />
    <Text style={styles.title}>Welcome productivity.</Text>
    <TextInput
      mode='outlined'
      style={styles.textInput}
      label= 'Email Address'
      keyboardType='email-address'
      placeholder='e.g. csGods@gmail.com'
      value={email}
      onChangeText={handleEmailUpdate}
      autoCapitalize="none"
      returnKeyType="next"
      blurOnSubmit={false}
      />
    <TextInput
      mode='outlined'
      style={styles.textInput}
      label= 'Password'
      placeholder=''
      value={password}
      onChangeText={handlePasswordUpdate}
      autoCapitalize="none"
      right={
        <TextInput.Icon name={isPasswordVisible ? "eye-off" : "eye"}
        onPress={() => setIsPasswordVisible((state) => !state)} />
      }
      secureTextEntry={!isPasswordVisible}
      blurOnSubmit={false}
      />
    <Button
      style={{marginBottom: 10, borderRadius: 10, width: 350}}
      mode="contained"
      contentStyle={{ paddingVertical: 5 }}
      onPress={() => emailSignIn()}>
        Log In
    </Button>

    <Button
      style={{marginBottom: 10, borderRadius: 10, width: 350}}
      mode="contained"
      color='#fdfaf6'
      contentStyle={{ paddingVertical: 5 }}
      onPress={() => navigation.navigate("SignUp") }>
        Create Account
    </Button>
    <Pressable onPress={() => {}}>
        <Text
        style={styles.forgotPasswordLink} 
        onPress={() => navigation.navigate("ForgotPassword")}>
          Forgot something?</Text>
    </Pressable>
  </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fde3e4',
  },
  title: {
    alignContent: 'flex-start',
    marginBottom: 10,
    fontSize: 28,
    fontFamily:'sans-serif-condensed'
  },
  image: {
    resizeMode: "contain",
    height: 125,
    width: 600,
  },
  textInput: {
    width: 350,
    marginBottom: 10,
    backgroundColor: '#fdfaf6',
    fontFamily: 'sans-serif-condensed'
  },
  forgotPasswordLink: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
    color: colors.secondaryLight
  },
})
