import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, StyleSheet} from 'react-native';
import { FAB, Appbar } from 'react-native-paper'
import { useDispatch } from 'react-redux';

import TodoList from '../../component/todoList';
import { clearTodo } from '../../slice/todoListSlice';

export default function FixListScreen( { navigation } ) {
  const dispatch = useDispatch();

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: '#30292f',}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="FixList" />
        <Appbar.Action icon="dots-vertical" onPress={() => console.log('More options')}  />
      </Appbar.Header>
      <View style={{alignItems:'center',}}>
        <TodoList type={"fixList"} navigation={navigation}/>
      </View>
      <StatusBar style="light" />




      <FAB.Group
        visible={true}
        open={open}
        icon={open ? 'close' : 'plus'}
        actions={[
          { icon: 'delete',
            label: 'Clear',
            onPress: () => {
              console.log('Pressed Clear all')
              dispatch(clearTodo({type: "fixList"}))
            } },
          {
            icon: 'filter',
            label: 'Sort to Agenda',
            onPress: () => console.log('Pressed sorting'),
            small: false,
          },
          {
            icon: 'calendar',
            label: 'Add task',
            onPress: () => navigation.navigate("Edit", {type: 'fixList'}),
            small: false,
          }
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />

      {/* <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate("Edit", {type: 'fixList'})}
      /> */}
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      alignItems: 'stretch',
      backgroundColor: '#30292f',
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