import React from 'react'
import { Agenda } from 'react-native-calendars'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { Card, Appbar, Paragraph, Caption } from 'react-native-paper'
import { Feather } from '@expo/vector-icons'

import { useSelector } from 'react-redux';
import { selectTodoList } from '../../slice/todoListSlice';
import { today } from '../../api/Time';
import colorTheme from '../../presentational/colorTheme'

import Authentication from '../../api/Authentication'

export default function AgendaScreen( {  navigation } )  {
  const items = useSelector(selectTodoList).agenda;

  const renderThing = (item) => {
    return(
      <Card 
        style={{
          backgroundColor: item.color,
          flex: 1,
          borderRadius: 10,
          marginRight: 20,
          marginTop: 8,
        }}
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
              <Feather name="repeat" size={12} color="black" style={{marginTop: 6, color: colorTheme[item.color]}}/>
              <Caption style={{fontSize: 12, color: colorTheme[item.color]}}> {item.recurring} </Caption>
            </View>
          )}
        </Card.Content>
      </Card>
    )
  };


  return(
    <View style={{flex: 1}}>
      <Appbar.Header style={{backgroundColor: '#f7f7ff',}}>
        <Feather name='calendar' size={20} style={{marginLeft: 15}} />
        <Appbar.Content title="Agenda" />
        <Appbar.Action icon="exit-to-app" onPress={() => Authentication( {action: "signOut", event: () => navigation.navigate("Home") })} />
      </Appbar.Header>
      <Agenda
        items={items}
        selected={today()}
        renderItem={renderThing}
        style={{backgroundColor: '#f7f7ff'}}
        showClosingKnob={true}
        theme={{calendarBackground: '#f7f7ff'}}
      />
    </View>

  )
}

const styles = StyleSheet.create({
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
    color: 'white'
  },
  caption: {
    fontSize: 12,
    marginVertical: 0
  },
});