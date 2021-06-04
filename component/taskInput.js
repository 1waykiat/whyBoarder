import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { useDispatch } from 'react-redux';
import { addTodo } from '../slice/todoListSlice';

import { Button, TextInput } from 'react-native-paper'

export default function TaskInput( {type} ) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [start, setStart] = useState("00:00");
  const [end, setEnd] = useState("00:00");
  const add = () => dispatch(addTodo({
    type: type,
    name: text,
    start: start,
    end: end,
  }));

  return (
    <View>
      <TextInput
        ref={(input) => { this.firstTextInput = input; }}
        mode='outlined'
        style={styles.textInput}
        label= 'Task'
        value={text}
        onChangeText={(item) => setText(item)}
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
          onChangeText={(item) => setStart(item)}
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
          onChangeText={(item) => setEnd(item)}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => {
            add();
        }}
          blurOnSubmit={false}
          />
        </View>
      <Button
        style={{marginBottom: 10, borderRadius: 10, width: 350}}
        mode="contained"
        contentStyle={{ paddingVertical: 5 }}
        onPress={() => {
          add();
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