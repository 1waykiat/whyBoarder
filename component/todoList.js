import React from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeTodo, selectTodoList} from '../slice/todoListSlice';
import { Card, Title, Paragraph, Button } from 'react-native-paper'

export default function todoList( { type, navigation} ) {
  const todoList = type == "fixList" ? useSelector(selectTodoList).fixList : useSelector(selectTodoList).flexList;
  const dispatch = useDispatch();

  return (
    <View style={{height: 550}}>
      <FlatList
        style={{marginTop: 20, height: 20, flex: 1 }}
        data={todoList} 
        keyExtractor={item => item.key.toString()}
        renderItem={
          ({item}) => (
            <View style={{flexDirection: 'row'}}>

              <Card style={{width: 375, height: 130, marginBottom: 5}}>
                <Card.Content>
                  <Title>{item.name}</Title>
                  <Paragraph>{item.start} - {item.end}</Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button icon='close' onPress={() => dispatch(removeTodo({type: type, key: item.key}))}/>
                  <Button icon='check' onPress={() => navigation.navigate("Edit", {type: type, item: item} )}/>
                </Card.Actions>
              </Card>
            </View>
          )
        }
      />

      <Button
        style={{marginBottom: 10, borderRadius: 10, width: 350}}
        mode="contained"
        contentStyle={{ paddingVertical: 5 }}
        onPress={() => navigation.navigate("Edit", {type: type})}
        title="Add Item"
      >
        Add Item
      </Button>
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