import React from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity} from 'react-native';
import { useSelector } from 'react-redux';
import { selectTodoList} from '../slice/todoListSlice';
import { Card, Title, Paragraph,  } from 'react-native-paper'

export default function todoList( { type, navigation} ) {
  const todoList = type == "fixList" ? useSelector(selectTodoList).fixList : useSelector(selectTodoList).flexList;

  const dateTimeMerge = (date, time) => {
  if (date != undefined) {
      const dateArray = date.split("-");
      return new Date(new Date(dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0] + " " + time + ":00").toUTCString());
    }
    return new Date();
  }

  const timeToSimpleHumanDate = (time) => {
    const temp = new Date(time).toDateString().split(' ')
    return temp[0] + ', ' + temp[2] + ' ' + temp[1]
  }
  
  // Converts to local readable TIME
  const timeToHourMin = (time) => {
    const temp = new Date(time).toTimeString().split(' ')[0].split(':')
    return temp[0] + ':' + temp[1]
  }

  return (
    <View style={{justifyContent:'center', maxHeight: 692}}>
      <FlatList
        style={{height: 20, flex: 1 }}
        data={todoList} 
        keyExtractor={item => item.key.toString()}
        renderItem={
          ({item}) => (
            <View style={{flexDirection: 'row'}}>
              <Card style={{width: 375, maxHeight: 120, marginTop: 5}} onPress={() => navigation.navigate("Edit", {type: type, item: item} )}>
                <Card.Content>
                  <Title
                    style={{fontSize:16,}}
                  >{item.name}</Title>
                  {type == "fixList"
                    ? <Paragraph>
                      {timeToSimpleHumanDate(dateTimeMerge(item.startDate, item.startTime))}, {timeToHourMin(dateTimeMerge(item.startDate, item.startTime))} - { } 
                      {timeToHourMin(dateTimeMerge(item.endDate, item.endTime))}
                    </Paragraph>
                    : <Paragraph>
                        {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2,"0")}
                    </Paragraph>}
                </Card.Content>
              </Card>
            </View>
          )
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    width: 350,
    marginBottom: 10,
    backgroundColor: '#fdfaf6',
    fontFamily: 'sans-serif-condensed'
  },
  textInputSmall: {
    width: 175,
    marginBottom: 10,
    backgroundColor: '#fdfaf6',
    fontFamily: 'sans-serif-condensed'
  },

})