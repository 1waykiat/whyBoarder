import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, StyleSheet} from 'react-native';
import { FAB, Appbar } from 'react-native-paper'
import { useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';

import TodoList from '../../component/todoList';
import { clearTodo } from '../../slice/todoListSlice';

import Authentication from '../../api/Authentication';

export default function FixListScreen( { navigation } ) {
  const dispatch = useDispatch();

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: '#f7f7ff',}}>
        <Feather name="lock" size={20} style={{marginLeft: 15}}/>
        <Appbar.Content title="Fixboard" />
        <Appbar.Action icon="exit-to-app" onPress={() => Authentication( {action: "signOut", event: () => navigation.navigate("Home") })} />
      </Appbar.Header>
      <View style={{alignItems:'center',}}>
        <TodoList type={"fixList"} navigation={navigation}/>
      </View>
      <StatusBar style="auto" />




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
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      alignItems: 'stretch',
      backgroundColor: '#f7f7ff',
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
