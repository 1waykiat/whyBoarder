import React from 'react';
import { FlatList, View, StyleSheet} from 'react-native';
import { useSelector } from 'react-redux';
import { selectTodoList } from '../slice/todoListSlice';
import { Card, Paragraph, Caption } from 'react-native-paper'
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import colorTheme from '../presentational/colorTheme';


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
            <View style={{flexDirection: 'row',}}>
              <Card 
                style={{width: 375, maxHeight: 120, marginTop: 5, borderRadius: 6, backgroundColor: item.color}}
                onPress={() => navigation.navigate("Edit", {type: type, item: item} )}
                mode='elevated'
              >
                <Card.Content>
                  <View style={{flexDirection: 'row'}}>
                    <Paragraph
                      style={styles.paragraph}
                    >{item.name}
                    </Paragraph>
                    { type == "flexList" && (
                      <MaterialCommunityIcons name="star" size={18} color="#ffe46b" style={{marginTop: 2.5, marginHorizontal: 3}} />
                    )}
                  </View>
                  
                  <View style={{flexDirection: 'column'}}>
                    {type == "fixList"
                      ? <Caption style={styles.caption}>
                        {
                          item.startDate != item.endDate 
                          ? timeToSimpleHumanDate(dateTimeMerge(item.startDate, item.startTime)) + ", " + timeToHourMin(dateTimeMerge(item.startDate, item.startTime)) + " - " +
                            timeToSimpleHumanDate(dateTimeMerge(item.endDate, item.endTime)) + ", " + timeToHourMin(dateTimeMerge(item.endDate, item.endTime))
                          : timeToSimpleHumanDate(dateTimeMerge(item.startDate, item.startTime)) + " · " + timeToHourMin(dateTimeMerge(item.startDate, item.startTime)) + " - " +
                            timeToHourMin(dateTimeMerge(item.endDate, item.endTime))
                        }
                      </Caption>
                      :
                      <View style={{flexDirection: 'row'}}>
                        <Caption style={styles.caption}>
                          {Math.floor(item.duration / 60)} hr {(item.duration % 60)} mins
                        </Caption>
                        <Caption style={styles.caption}> · </Caption>
                        { (type == "flexList" && item.timePreference[0]) && (
                          <Feather name="moon" size={14} color="black" style={{marginTop: 4, color: colorTheme[item.color]}}/>
                        )}                                          
                        { (type == "flexList" && item.timePreference[1]) && (
                          <Feather name="sunrise" size={14} color="black" style={{marginTop: 4, color: colorTheme[item.color]}}/>
                        )}                                          
                        { (type == "flexList" && item.timePreference[2]) && (
                          <Feather name="sun" size={14} color="black" style={{marginTop: 4, color: colorTheme[item.color]}}/>
                        )}                                          
                        { (type == "flexList" && item.timePreference[3]) && (
                          <Feather name="sunset" size={14} color="black" style={{marginTop: 4, color: colorTheme[item.color]}}/>
                        )}    
                      </View>
                    }
                    {item.recurring != "Does not repeat" && (
                      <View style={{flexDirection: 'row'}}>
                        <Feather name="repeat" size={12} color="black" style={{marginTop: 6, color: colorTheme[item.color]}}/>
                        <Caption style={styles.caption}> {item.recurring}</Caption>
                      </View>                         
                    )}
                  </View>
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
    color: 'white'
  },
  caption: {
    fontSize: 12,
    marginVertical: 0
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