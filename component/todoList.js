import React from 'react';
import { FlatList, View, StyleSheet} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeTodo, selectTodoList} from '../slice/todoListSlice';
import { Card, Title, Paragraph, Button } from 'react-native-paper'
import TaskInput from './taskInput';

export default function todoList( { type, navigation} ) {
  const todoList = type == "fixList" ? useSelector(selectTodoList).fixList : useSelector(selectTodoList).flexList;
  const dispatch = useDispatch();

  return (
    <View>
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
      
      <TaskInput type={type}/>
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