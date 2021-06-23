import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Appbar, Button } from 'react-native-paper'

import TaskSorter from '../TaskSorter';

import Authentication from '../api/Authentication';

export default function ProfileScreen( { navigation } ) {
  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="Settings" />
        <Appbar.Action icon="dots-vertical" onPress={() => console.log('More options')} />
      </Appbar.Header>
      <Button
        mode='contained'
        onPress={() => {
          Authentication( {action: "signOut", event: () => navigation.navigate("Home") })
        }}
        style={styles.button}
      >
        Sign out T.T
      </Button>
      <Text
        style={{color:'gray'}}
      >
        Task Sorter Settings
      </Text>

      <TaskSorter />
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