import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Portal, Modal, FAB } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Authentication from '../../api/Authentication';
import Database from '../../api/Database';
import DateTimeInput from '../../component/dateTimeInput';

import TodoList from '../../component/todoList';
import { selectTodoList } from '../../slice/todoListSlice';

export default function FixListScreen( { navigation } ) {
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const todoList = useSelector(selectTodoList);
  return (
    <View style={styles.container}>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
          <DateTimeInput type={'fixList'} event={hideModal}/>
        </Modal>
      </Portal>
        <TodoList type={"fixList"} navigation={navigation}/>
          <TouchableOpacity
              style={{marginBottom: 10, borderRadius: 10, width: 350}}
              onPress={() => {
                Authentication( {action: "signOut", event: () => navigation.navigate("Home") })
              }}
          >
              <Text styles={ {marginTop: 20}}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={{marginBottom: 10, borderRadius: 10, width: 350}}
              onPress={() => {
                Database( {action: "upload", data: todoList, event: () => {}} )
              }}
          >
              <Text styles={ {marginTop: 20}}>Upload</Text>
          </TouchableOpacity>
        <StatusBar style="auto" />
        <FAB 
        style={styles.fab}
        icon="plus"
        onPress={showModal}
        />
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
    containerStyle: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 15,
      width: 380,
      marginLeft: 15,
    },
    fab: {
      position: 'absolute',
      margin: 10,
      right: 0,
      bottom: 10,
    },
    });