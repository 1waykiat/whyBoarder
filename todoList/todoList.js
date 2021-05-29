import React, { useState } from 'react';
import { FlatList, View, Text, StyleSheet} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, removeTodo, selectTodoList} from './todoListSlice';
import { Card, Title, Paragraph, Button, IconButton, Actions, TextInput } from 'react-native-paper'

export default function todoList() {
  const todoList = useSelector(selectTodoList);
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  return (
    <View>
      <FlatList
        style={{marginTop: 20, height: 20, flex: 1 }}
        data={todoList}
        key={item => item.key}
        renderItem={
          ({item}) => (
            <View style={{flexDirection: 'row'}}>
              <Card style={{width: 375, height: 130, marginBottom: 5}}>
                <Card.Content>
                  <Title>{item.name}</Title>
                  <Paragraph>0900 - 10??</Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button icon='close' onPress={() => dispatch(removeTodo(item.key))}/>
                  <Button icon='check' onPress={() => {}}/>
                </Card.Actions>
              </Card>
            </View>
          )
        }
      />
      <TextInput
        mode='outlined'
        style={styles.textInput}
        label= 'Task'
        value={text}
        onChangeText={(item) => setText(key=item)}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => passwordTextInput.current.focus()}
        blurOnSubmit={false}
      />
      <Button
        style={{marginBottom: 10, borderRadius: 10, width: 350}}
        mode="contained"
        contentStyle={{ paddingVertical: 5 }}
        onPress={() => dispatch(addTodo(text))}
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
})