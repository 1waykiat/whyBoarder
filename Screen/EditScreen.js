import React, {useState} from 'react'
import { Text, Button, TextInput } from 'react-native-paper'
import { View, StyleSheet, Image, Pressable } from 'react-native'

import colors from '../presentational/colors';
import { useDispatch } from 'react-redux';
import { editTodo } from '../todoList/todoListSlice';


export default function EditScreen( { navigation, route } ) {
  const input = route.params;
  const item = input.item;
  const [name, setName] = useState(item.name);
  const [start, setStart] = useState(item.start);
  const [end, setEnd] = useState(item.end);
  const dispatch = useDispatch();

  return(
  <View style={styles.container}>
    <Image style={styles.image} source={require('../assets/logo.png')} />
    <Text style={styles.title}>Welcome productivity.</Text>
    <TextInput
      mode='outlined'
      style={styles.textInput}
      label= 'Name'
      value={name}
      onChangeText={(text) => setName(text)}
      autoCapitalize="none"
      returnKeyType="next"
      onSubmitEditing={() => { this.secondTextInput.focus(); }}
      blurOnSubmit={false}
     />
    <TextInput
      ref={(input) => { this.secondTextInput = input; }}
      mode='outlined'
      style={styles.textInput}
      label= 'Start Time'
      value={start}
      onChangeText={(text) => setStart(text)}
      autoCapitalize="none"
      returnKeyType="next"
      onSubmitEditing={() => { this.thirdTextInput.focus(); }}
      blurOnSubmit={false}
     />
    <TextInput
      ref={(input) => { this.thirdTextInput = input; }}
      mode='outlined'
      style={styles.textInput}
      label= 'End Time'
      value={end}
      onChangeText={(text) => setEnd(text)}
      autoCapitalize="none"
      returnKeyType="next"
      blurOnSubmit={false}
      onSubmitEditing={() => {
        dispatch(editTodo({
          type: input.type,
          name: name,
          key: item.key,
          start: start,
          end: end,
        }));
        navigation.goBack();}
      }
    />

    <Button
      style={{marginBottom: 10, borderRadius: 10, width: 350}}
      mode="contained"
      color='#fdfaf6'
      contentStyle={{ paddingVertical: 5 }}
      onPress={() => {
        dispatch(editTodo({
          name: name,
          key: input.key,
          start: start,
          end: end,
        }));
        navigation.goBack();
      }}>
        Update
    </Button>
  </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fde3e4',
  },
  title: {
    alignContent: 'flex-start',
    marginBottom: 10,
    fontSize: 28,
    fontFamily:'sans-serif-condensed'
  },
  image: {
    resizeMode: "contain",
    height: 125,
    width: 600,
  },
  textInput: {
    width: 350,
    marginBottom: 10,
    backgroundColor: '#fdfaf6',
    fontFamily: 'sans-serif-condensed'
  },
  forgotPasswordLink: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
    color: colors.secondaryLight
  },
})