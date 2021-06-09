import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Portal, Modal, FAB, } from 'react-native-paper'
import DateTimeInput from '../../component/dateTimeInput';

import TodoList from '../../component/todoList';

export default function FlexibleListScreen( { navigation } ) {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
          <DateTimeInput type={'flexList'} event={hideModal} />
        </Modal>
      </Portal>
      <TodoList type={"flexList"} navigation={navigation}/>
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