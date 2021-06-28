import React, { useState } from 'react';
import { Text, Button, TextInput } from 'react-native-paper'
import { View, StyleSheet, Image, Alert } from 'react-native'

import Authentication from '../api/Authentication'

export default function ForgotPasswordScreen( {navigation} ) {
  const [email, setEmail] = useState('')

  const handleEmailUpdate = (text) => setEmail(text)
  
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
        onSubmitEditing={() => passwordTextInput.current.focus()}
        blurOnSubmit={false}
        />
      
      <Button
        style={{marginBottom: 10, borderRadius: 10, width: 350}}
        mode="contained"
        contentStyle={{ paddingVertical: 5 }}
        onPress={() => {
          Authentication( {action: "forgotPassword", email, event: () => Alert.alert("Reset password email has been sent! ")} )
        }}>
          Reset Password
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
