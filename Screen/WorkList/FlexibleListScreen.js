import React from 'react';
import { View, StyleSheet } from 'react-native'
import { FAB, Appbar } from 'react-native-paper'

import TodoList from '../../component/todoList'

export default function FlexibleListScreen( { navigation } ) {
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

    return (
      <View style={styles.container}>
        <Appbar.Header style={{backgroundColor: '#B3E3F8'}}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="FlexList" />
          <Appbar.Action icon="dots-vertical" onPress={() => console.log('More options')} />
        </Appbar.Header>
        <View style={{alignItems: 'center'}}>
          <TodoList type={"flexList"} navigation={navigation}/>
        </View>
        <FAB.Group
          visible={true}
          open={open}
          icon={open ? 'close' : 'plus'}
          actions={[
            { icon: 'delete',
              label: 'Clear',
              onPress: () => console.log('Pressed Clear all') },
            {
              icon: 'filter',
              label: 'Sort to Agenda',
              onPress: () => console.log('Pressed sorting'),
              small: false,
            },
            {
              icon: 'calendar',
              label: 'Add task',
              onPress: () => navigation.navigate("Edit", {type: 'flexList'}),
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
      backgroundColor: '#B3E3F8',
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