import React, { useState } from 'react'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'
import { View, StatusBar, Text, TouchableOpacity, StyleSheet, Button, Platform } from 'react-native'
import { Card } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker';
import { current } from 'immer';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
}

const AgendaScreen = () => {
  const [items, setItems] = useState({
    "2021-05-28": [ {name: 'testing', startTime: '0900', endTime: '1200' },
      {name: 'testing2', startTime: '1200', endTime: '1600'}
    ],
    "2021-05-27": []
  })

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log(currentDate)
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  
  const print = (x) => {
    console.log(x)
  }

  const loadItems = (day) => {
    setTimeout(() => {
      // for (let i = -15; i < 85; i++) {
      //   const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      //   const strTime = timeToString(time);
      //   console.log(strTime)
      //   if (!items[strTime]) {
      //     items[strTime] = [];
      //     const numItems = 1;
      //     for (let j = 0; j < numItems; j++) {
      //       items[strTime].push({
      //         name: 'Item for ' + strTime + ' #' + j,
      //         height: 1
      //       });
      //     }
      //   }
      // }
      items['2021-05-29'] = []
      items['2021-05-29'].push({
        name: 'Coding',
        startTime: '0900',
        endTime: '1200',
      })
      items['2021-05-31'] = []
      for( var i = 0; i < 10; i++){
        items['2021-05-31'].push({
          name: 'Submit Milestone 1',
          startTime: '0900',
          endTime: '1200',
        })
      }
    }, 1000);
  }

  const renderThing = (item) => {
    return(
    <TouchableOpacity>
      <Card style={styles.item}>
        <Card.Content>
          <Text style={styles.task}>{item.name}</Text>
          <Text>{item.startTime + ' - ' + item.endTime}</Text>  
        </Card.Content>
      </Card>
    </TouchableOpacity>
    )    
  }


  return(
    <View style={{flex: 1}}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={'2021-05-28'}
        renderItem={renderThing}
      />
      <Button onPress={showDatepicker} title="Show date picker!" />
      <Button onPress={showTimepicker} title="Show time picker!" />
      {show && (
        <RNDateTimePicker
          timeZoneOffsetInSeconds={7200}
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>

  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 20,
    marginTop: 8,
  },
  task: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});

export default AgendaScreen