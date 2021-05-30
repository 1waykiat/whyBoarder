import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import {signOut} from '../api/Authentication';
import TodoList from '../todoList/todoList';

export default function ListScreen( { navigation } ) {
    return (
            <View style={styles.container}>
                <TodoList navigation={navigation}/>
                <TouchableOpacity
                    style={{marginBottom: 10, borderRadius: 10, width: 350}}
                    onPress={() => {
                        (signOut())
                        navigation.navigate("Home");
                    }}
                >
                    <Text styles={ {marginTop: 20}}>Sign Out</Text>
                </TouchableOpacity>
                <StatusBar style="auto" />
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