import React, { useState } from 'react'
import { Agenda } from 'react-native-calendars'
import { View, Text, TouchableOpacity, StyleSheet, Button, Platform } from 'react-native'
import { Card } from 'react-native-paper'

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
    console.log(currentDate);
    console.log(timeToHourMin(currentDate));
    console.log(timeToDate(currentDate));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  // const loadItems = (day) => {
  //   setTimeout(() => {
  //     // for (let i = -15; i < 85; i++) {
  //     //   const time = day.timestamp + i * 24 * 60 * 60 * 1000;
  //     //   const strTime = timeToString(time);
  //     //   console.log(strTime)
  //     //   if (!items[strTime]) {
  //     //     items[strTime] = [];
  //     //     const numItems = 1;
  //     //     for (let j = 0; j < numItems; j++) {
  //     //       items[strTime].push({
  //     //         name: 'Item for ' + strTime + ' #' + j,
  //     //         height: 1
  //     //       });
  //     //     }
  //     //   }
  //     // }
  //     items['2021-05-29'] = []
  //     items['2021-05-29'].push({
  //       name: 'Coding',
  //       startTime: '0900',
  //       endTime: '1200',
  //     })
  //     items['2021-05-31'] = []
  //     for( var i = 0; i < 10; i++){
  //       items['2021-05-31'].push({
  //         name: 'Submit Milestone 1',
  //         startTime: '0900',
  //         endTime: '1200',
  //       })
  //     }
  //   }, 1000);
  // }

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
      <Agenda
        items={items}
        // loadItemsForMonth={loadItems}
        selected={'2021-05-28'}
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