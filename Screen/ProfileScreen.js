import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Appbar, Button } from 'react-native-paper'
import { useSelector } from 'react-redux';

import Authentication from '../api/Authentication';

export default function ProfileScreen( { navigation } ) {
  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="Chris" subtitle="e123456x@nus.edu.sg" />
        <Appbar.Action icon="dots-vertical" onPress={() => console.log('More options')} />
      </Appbar.Header>
      <Text style={styles.title}>Welcome back!</Text>
      <Button
        mode='contained'
        onPress={() => {
          Authentication( {action: "signOut", event: () => navigation.navigate("Home") })
        }}
        style={styles.button}
      >
        Sign out T.T
      </Button>
    </View>  
  )
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      alignItems: 'stretch',
      backgroundColor: 'white',
    },
    title: {
      fontSize: 36,
      fontWeight:'900',
      padding: 10,
    },
    button: {
      margin: 20,
      backgroundColor: 'red'
    }
  });