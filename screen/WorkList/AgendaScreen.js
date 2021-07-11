import React from 'react'
import { Agenda } from 'react-native-calendars'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { Card, Appbar, Paragraph, Caption } from 'react-native-paper'
import { Feather } from '@expo/vector-icons'

import { useSelector } from 'react-redux';
import { selectTodoList } from '../../slice/todoListSlice';
import { today } from '../../api/Time';

export default function AgendaScreen( {  navigation } )  {
  const items = useSelector(selectTodoList).agenda;

  const renderThing = (item) => {
    return(
      <Card 
        style={styles.item}
        onPress={() => console.log('What to do....')}
      >
        <Card.Content>
          <Paragraph
            style={styles.paragraph}
          >{item.name}
          </Paragraph>
          <Caption style={styles.caption}>
            {item.startTime + ' - ' + item.endTime} 
          </Caption>
          {item.recurring != "Does not repeat" && (
            <View style={{flexDirection: 'row'}}>
              <Feather name="repeat" size={12} color="black" style={{marginTop: 6, color: '#8c8c8c'}}/>
              <Caption style={styles.caption}> {item.recurring} </Caption>
            </View>
          )}
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
  paragraph : {
    fontSize: 17,
    color: 'black'
  },
  caption: {
    fontSize: 12,
    marginVertical: 0
  },
});