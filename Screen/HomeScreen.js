import React from 'react';
import { Text, Button, } from 'react-native-paper'
import { View, StyleSheet, Image, } from 'react-native'

export default function HomeScreen( {navigation} ) {
return(
  <View style={styles.container}>
    <Image style={styles.image} source={require('../assets/logo.png')} />
    <Text style={styles.title}>Welcome productivity.</Text>
    <Button
      style={{marginBottom: 10, borderRadius: 10, width: 350}}
      mode="contained"
      contentStyle={{ paddingVertical: 5 }}
      onPress={() => {navigation.navigate("SignIn")}
      }>
      Sign In
    </Button>
    <Button
      style={{marginBottom: 10, borderRadius: 10, width: 350}}
      mode="contained"
      color='#fdfaf6'
      contentStyle={{ paddingVertical: 5 }}
      onPress={() => navigation.navigate("SignUp")
      }>
        Create Account
    </Button>
  </View>
)
}

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
});