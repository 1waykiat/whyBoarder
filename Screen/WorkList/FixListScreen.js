import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { FAB, Appbar } from 'react-native-paper'
import { useSelector } from 'react-redux';

import Authentication from '../../api/Authentication';
import Database from '../../api/Database';

import TodoList from '../../component/todoList';
import { selectTodoList } from '../../slice/todoListSlice';

export default function FixListScreen( { navigation } ) {

  const todoList = useSelector(selectTodoList);
  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: '#fad8bf',}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="FixList" />
        <Appbar.Action icon="dots-vertical" onPress={() => console.log('More options')}  />
      </Appbar.Header>
      <View style={{alignItems:'center',}}>
        <TodoList type={"fixList"} navigation={navigation}/>
      </View>
        {/* <TouchableOpacity
            style={{marginBottom: 10, borderRadius: 10, width: 350}}
            onPress={() => {
              Authentication( {action: "signOut", event: () => navigation.navigate("Home") })
            }}
        >
            <Text styles={ {marginTop: 20}}>Sign Out</Text>
        </TouchableOpacity>
         */}
      <StatusBar style="dark" />


      <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate("Edit", {type: 'fixList'})}
      />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      alignItems: 'stretch',
      backgroundColor: '#fad8bf',
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
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    });