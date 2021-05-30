import React, {useState} from 'react'
import { Text, Button, TextInput } from 'react-native-paper'
import { View, StyleSheet, Image, Pressable } from 'react-native'

import colors from '../presentational/colors';
import { useDispatch } from 'react-redux';
import { editTodo } from '../todoList/todoListSlice';


export default function signIn( { navigation, route } ) {
  const input = route.params;
  const [name, setName] = useState(input.name);
  const [start, setStart] = useState(input.start);
  const [end, setEnd] = useState(input.end);
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
      blurOnSubmit={false}
      />
    <TextInput
      mode='outlined'
      style={styles.textInput}
      label= 'Start Time'
      value={start}
      onChangeText={(text) => setStart(text)}
      autoCapitalize="none"
      returnKeyType="next"
      blurOnSubmit={false}
      />
    <TextInput
      mode='outlined'
      style={styles.textInput}
      label= 'End Time'
      value={end}
      onChangeText={(text) => setEnd(text)}
      autoCapitalize="none"
      returnKeyType="next"
      blurOnSubmit={false}
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
        }))
        navigation.pop() 
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