import React, { useState } from 'react';
import { FlatList, TextInput, View, Text, StyleSheet, Button} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, removeTodo, selectTodoList} from './todoListSlice';

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
              <Text>
                {item.key}: {item.name}
              </Text>
              <Button
                style={{marginBottom: 5, borderRadius: 5, width: 10}}
                mode="contained"
                color='black'
                contentStyle={{ paddingVertical: 5 }}
                onPress={() => dispatch(removeTodo(item.key))}
                title="Clear"
              />
            </View>
          )
        }
      />
      <TextInput
        style={styles.textInput}
        placeholder={"Activity Name"}
        onChangeText={(item) => setText(key=item)}
      />
      <Button
        style={{marginBottom: 10, borderRadius: 10, width: 350, flex :1}}
        mode="contained"
        color='black'
        contentStyle={{ paddingVertical: 5 }}
        onPress={() => dispatch(addTodo(text))}
        title="Add Item"
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
})