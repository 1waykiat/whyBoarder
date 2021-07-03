import React from 'react'
import { Agenda } from 'react-native-calendars'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { Card, Appbar } from 'react-native-paper'

import { useSelector } from 'react-redux';
import { selectTodoList } from '../../slice/todoListSlice';
import { today } from '../../api/Time';

export default function AgendaScreen( {  navigation } )  {
  const items = useSelector(selectTodoList).agenda;

  const renderThing = (item) => {
    return(
      <Card 
        style={styles.item}
        onPress={() => console.log('To Do')}
      >
        <Card.Content>
          <Text style={styles.task}>{item.name}</Text>
          <Text>{item.startTime + ' - ' + item.endTime}</Text>  
        </Card.Content>
      </Card>
    )
  };


  return(
    <View style={{flex: 1}}>
      <Appbar.Header style={{backgroundColor: 'white',}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Agenda" />
        <Appbar.Action icon="dots-vertical" onPress={() => console.log('More options')}  />
      </Appbar.Header>
      <Agenda
        items={items}
        selected={today()}
        renderItem={renderThing}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
    marginRight: 20,
    marginTop: 8,
  },
  task: {
    fontSize: 16,
    fontWeight: '900',
  },
  subheading: {
    fontSize: 10,
    color: 'gray'
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});