import React, {useState} from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { useSelector } from 'react-redux';
import { selectTodoList } from '../slice/todoListSlice';
import { Card, Paragraph, Caption, Title } from 'react-native-paper'


export default function todoList( { type, navigation} ) {
  const todoList = type == "fixList" ? useSelector(selectTodoList).fixList : useSelector(selectTodoList).flexList;
  const [visible, setVisible] = useState(false)
  const toggleModal = () => setVisible(!visible)

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
            <View style={{flexDirection: 'row',}}>
              <Card 
                style={{width: 375, maxHeight: 120, marginTop: 5, }}
                onPress={() => navigation.navigate("Edit", {type: type, item: item} )}
                mode='elevated'
              >
                <Card.Content>
                  <Paragraph
                    style={styles.paragraph}
                  >{item.name}</Paragraph>
                  {type == "fixList"
                    ? <Caption>
                      {timeToSimpleHumanDate(dateTimeMerge(item.startDate, item.startTime))} · {timeToHourMin(dateTimeMerge(item.startDate, item.startTime))} - { } 
                      {timeToHourMin(dateTimeMerge(item.endDate, item.endTime))}
                    </Caption>
                    : <Caption>
                      {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2,"0")}
                    </Caption>}
                    <View style={styles.colorcode} />
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
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column'
  },
  paragraph : {
    fontSize: 17,
    
  },
  caption: {
    fontSize: 14,
  },
  colorcode: {
    backgroundColor: 'gray',
    width: 20,
    flex: 1,
    position:'absolute',
    overflow:'hidden',
    borderTopLeftRadius: 3,
    opacity:0.8
  }
})