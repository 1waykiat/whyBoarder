import React, { useState } from 'react'
import { Agenda } from 'react-native-calendars'
import { View, Text, TouchableOpacity, StyleSheet, Button, Platform } from 'react-native'
import { Card, Appbar } from 'react-native-paper'

import { useSelector } from 'react-redux';
import { selectTodoList } from '../../slice/todoListSlice';

const timeToDate = (time) => {
  const temp = new Date(time);
  return temp.toISOString().split('T')[0];
}

const timeToHourMin = (time) => {
  const temp = new Date(time).getTimezoneOffset().toISOString().split('T')[1].split(':')
  return temp[0] + ':' + temp[1];
}

const AgendaScreen = () => {
  const items = useSelector(selectTodoList).agenda;
  const temp = (new Date(Date.now())).toLocaleDateString().split('/');
  const today = (new Date(Date.now())).toLocaleString().split(" ")[4]+"-"+temp[0].padStart(2, "0")+"-"+temp[1].padStart(2, "0");

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

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
  }


  return(
    <View style={{flex: 1}}>
      <Appbar.Header style={{backgroundColor: 'white',}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Agenda" />
        <Appbar.Action icon="dots-vertical" onPress={() => console.log('More options')}  />
      </Appbar.Header>
      <Agenda
        items={items}
        // loadItemsForMonth={loadItems}
        selected={today}
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

export default AgendaScreen
