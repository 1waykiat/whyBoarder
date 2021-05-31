import React, { useState } from 'react';
import { FlatList, View, StyleSheet} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, removeTodo, selectTodoList} from './todoListSlice';
import { Card, Title, Paragraph, Button, TextInput } from 'react-native-paper'

export default function todoList( { type, navigation} ) {
  const todoList = type == "fixList" ? useSelector(selectTodoList).fixList : useSelector(selectTodoList).flexList;
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [start, setStart] = useState("00:00");
  const [end, setEnd] = useState("00:00");

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
      <TextInput
        ref={(input) => { this.firstTextInput = input; }}
        mode='outlined'
        style={styles.textInput}
        label= 'Task'
        value={text}
        onChangeText={(item) => setText(key=item)}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => { this.secondTextInput.focus(); }}
        blurOnSubmit={false}
      />
      <View  style={{flexDirection: "row"}}>
        <TextInput
          ref={(input) => { this.secondTextInput = input; }}
          mode='outlined'
          style={styles.textInputSmall}
          label= 'Start Time'
          value={start}
          onChangeText={(item) => setStart(key=item)}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => { this.thirdTextInput.focus(); }}
          blurOnSubmit={false}
          />
        <TextInput
          ref={(input) => { this.thirdTextInput = input; }}
          mode='outlined'
          style={styles.textInputSmall}
          label= 'End Time'
          value={end}
          onChangeText={(item) => setEnd(key=item)}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => dispatch(addTodo({
            type: type,
            name: text,
            start: start,
            end: end,
          }))}
          blurOnSubmit={false}
          />
        </View>
      <Button
        style={{marginBottom: 10, borderRadius: 10, width: 350}}
        mode="contained"
        contentStyle={{ paddingVertical: 5 }}
        onPress={() => {
          dispatch(addTodo({
            name: text,
            start: start,
            end: end,
           }));
          this.firstTextInput.focus();
        }}
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
  textInputSmall: {
    width: 175,
    marginBottom: 10,
    backgroundColor: '#fdfaf6',
    fontFamily: 'sans-serif-condensed'
  },
})