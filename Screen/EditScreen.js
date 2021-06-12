import React, {useState} from 'react'
import { Text, Button, TextInput } from 'react-native-paper'
import { View, StyleSheet, Image } from 'react-native'

import colors from '../presentational/colors';
import { useDispatch } from 'react-redux';
import { addTodo, editTodo } from '../slice/todoListSlice';

import RNDateTimePicker from '@react-native-community/datetimepicker';

export default function EditScreen( { navigation, route } ) {
  const input = route.params;
  const item = input.item;

  const [name, setName] = useState(item == undefined ? "" : item.name);
  const [startDate, setStartDate] = useState(item == undefined ? "2021-01-01" : item.startDate);
  const [startTime, setStartTime] = useState(item == undefined ? "00:00" : item.startTime);
  const [endDate, setEndDate] = useState(item == undefined ? "2021-01-01" : item.endDate);
  const [endTime, setEndTime] = useState(item == undefined ? "00:00" : item.endTime);
  const [duration, setDuration] = useState(item == undefined ? "0" : item.duration);
  const [recurring, setRecurring] = useState(item == undefined ? true : item.recurring);
  const dispatch = useDispatch();

  
  const reducer = () => {
    const fixListItem = {
      name: name,
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      recurring: true,
    };
  
    const flexListItem = {
      name: name,
      duration: duration,
      recurring: true,
    };
  
    const newItem = input.type == "fixList" ? fixListItem : flexListItem;
    
    if (item == undefined) {
      return dispatch(addTodo( {
        type: input.type,
        newItem: newItem,
      } ));
    } else {  
      return dispatch(editTodo( {
        type: input.type,
        key: item.key,
        newItem: {...newItem, key: item.key},
      } ));
    }
  };

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
    <View style={{flexDirection:"row"}}>
      <TextInput
        ref={(input) => { this.secondTextInput = input; }}
        mode='outlined'
        style={styles.textInputSmall}
        label= 'Start Date'
        value={startDate}
        onChangeText={(text) => setStartDate(text)}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => { this.thirdTextInput.focus(); }}
        blurOnSubmit={false}
       />
      <TextInput
        ref={(input) => { this.thirdTextInput = input; }}
        mode='outlined'
        style={styles.textInputSmall}
        label= 'Start Time'
        value={startTime}
        onChangeText={(text) => setStartTime(text)}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => { this.fourthTextInput.focus(); }}
        blurOnSubmit={false}
      />
    </View>

    <View style={{flexDirection:"row"}}>
      <TextInput
        ref={(input) => { this.fourthTextInput = input; }}
        mode='outlined'
        style={styles.textInputSmall}
        label= 'End Date'
        value={endDate}
        onChangeText={(text) => setEndDate(text)}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => { this.fifthTextInput.focus(); }}
        blurOnSubmit={false}
       />
      <TextInput
        ref={(input) => { this.fifthTextInput = input; }}
        mode='outlined'
        style={styles.textInputSmall}
        label= 'End Time'
        value={endTime}
        onChangeText={(text) => setEndTime(text)}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => { this.sixthTextInput.focus(); }}
        blurOnSubmit={false}
      />
    </View>

    <TextInput
      ref={(input) => { this.sixthTextInput = input; }}
      mode='outlined'
      style={styles.textInput}
      label= 'Duration'
      value={duration}
      onChangeText={(text) => setDuration(text)}
      autoCapitalize="none"
      returnKeyType="next"
      blurOnSubmit={false}
      onSubmitEditing={() => { this.seventhTextInput.focus(); }}
    />

    <TextInput
      ref={(input) => { this.seventhTextInput = input; }}
      mode='outlined'
      style={styles.textInput}
      label= 'Recurring'
      value={recurring}
      onChangeText={(text) => setRecurring(text)}
      autoCapitalize="none"
      returnKeyType="next"
      blurOnSubmit={false}
      onSubmitEditing={() => {
        reducer();
        navigation.goBack();}
      }
    />

    <Button
      style={{marginBottom: 10, borderRadius: 10, width: 350}}
      mode="contained"
      color='#fdfaf6'
      contentStyle={{ paddingVertical: 5 }}
      onPress={() => {
        reducer();
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
  textInputSmall: {
    width: 175,
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