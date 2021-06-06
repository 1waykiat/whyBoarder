import React, { useState } from 'react';
import { Text, Button, TextInput } from 'react-native-paper'
import { View, StyleSheet, Image, Alert } from 'react-native'

import Authentication from '../api/Authentication';

export default function SignUpScreen( {navigation} ) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password1, setPassword1] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);

  const handleEmailUpdate = (text) => setEmail(text)
  const handlePasswordUpdate = (text) => setPassword(text)
  const handlePasswordUpdate1 = (text) => setPassword1(text)

  const createAccount = () => Authentication( {action: "createAccount", email, password, event: () => {
    Authentication( {action: "emailVerification", event: () => {
      Alert.alert("Verification email has been sent to " + email);
      navigation.navigate("SignIn");
    }} )
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
        onSubmitEditing={() => { this.secondTextInput.focus(); }}
        blurOnSubmit={false}
        />
      
      <TextInput
        ref={(input) => { this.secondTextInput = input; }}
        mode='outlined'
        style={styles.textInput}
        label= 'Password'
        placeholder=''
        value={password}
        onChangeText={handlePasswordUpdate}
        autoCapitalize="none"
        right={<TextInput.Icon name={isPasswordVisible ? "eye-off" : "eye"}
          onPress={() => setIsPasswordVisible((state) => !state)} />}
        secureTextEntry={!isPasswordVisible}
        onSubmitEditing={() => { this.thirdTextInput.focus(); }}
        blurOnSubmit={false}
        />

      <TextInput
        ref={(input) => { this.thirdTextInput = input; }}
        mode='outlined'
        style={styles.textInput}
        label= 'Confirm Password'
        placeholder=''
        value={password1}
        onChangeText={handlePasswordUpdate1}
        autoCapitalize="none"
        right={<TextInput.Icon name={isPasswordVisible1 ? "eye-off" : "eye"}
          onPress={() => setIsPasswordVisible1((state) => !state)} />}
        secureTextEntry={!isPasswordVisible1}
        onSubmitEditing={() => {
          if (password == password1) {
            createAccount();
          } else {
            Alert.alert("Password does not match");
          } 
        }}
      />

      <Button
        style={{marginBottom: 10, borderRadius: 10, width: 350}}
        mode="contained"
        contentStyle={{ paddingVertical: 5 }}
        onPress={() => {
          if (password == password1) {
            createAccount();
          } else {
            Alert.alert("Password does not match");
          }
        }}
      >
          Create Account
      </Button>
    </View>
  )};
      
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
  })