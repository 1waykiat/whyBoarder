import React, {useState} from 'react'
import { Text, Button, TextInput, Divider, Appbar, Menu } from 'react-native-paper'
import { View, StyleSheet, Pressable } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'

import { useDispatch } from 'react-redux';
import { addTodo, editTodo, removeTodo } from '../slice/todoListSlice';

import RNDateTimePicker from '@react-native-community/datetimepicker';

// Converts to local readable DATE
const timeToHumanDate = (time) => {
  const temp = new Date(time).toDateString().split(' ')
  return temp[0] + ', ' + temp[2] + ' ' + temp[1] + ' ' + temp[3]
}

// Converts to local readable TIME
const timeToHourMin = (time) => {
  const temp = new Date(time).toTimeString().split(' ')[0].split(':')
  return temp[0] + ':' + temp[1]
}

// Converts to UTC YYYY-MM-DD 
const dateExtract = (time) => {
  const temp = new Date(time).toISOString().split('T')[0]
  return temp
} 

// Converts to UTC HH:MM 
const timeExtract = (time) => {
  const temp = new Date(time).toISOString().split('T')[1].split(":")
  return temp[0] + ':' + temp[1]
}

// Merges both the YYYY-MM-DD and HH:MM to return Date object
const dateTimeMerge = (date, time) => {
  return new Date(date + "T" + time + ":00.000Z")
}


export default function EditScreen( { navigation, route } ) {
  const input = route.params;
  const item = input.item;

  const [name, setName] = useState(item == undefined ? "" : item.name);
  // const [startDate, setStartDate] = useState(item == undefined ? dateExtract( new Date()) : item.startDate);
  // const [startTime, setStartTime] = useState(item == undefined ? "00:00" : item.startTime);
  // const [endDate, setEndDate] = useState(item == undefined ? dateExtract( new Date() ) : item.endDate);
  // const [endTime, setEndTime] = useState(item == undefined ? "00:00" : item.endTime);
  // const [duration, setDuration] = useState(item == undefined ? "0" : item.duration);
  const [hours, setHours] = useState(item == undefined ? "" : Math.floor(item.duration / 60))
  const [minutes, setMinutes] = useState(item == undefined ? "" : item.duration % 60)
  const [recurring, setRecurring] = useState(item == undefined ? "Does not repeat" : item.recurring);
  const dispatch = useDispatch();

  const [startDisplay, setStartDisplay] = useState(item == undefined ? new Date() : dateTimeMerge(item.startDate, item.startTime) )
  const [endDisplay, setEndDisplay] = useState(item == undefined ? new Date() : dateTimeMerge(item.endDate, item.endTime) )

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [begin, setBegin] = useState(true)

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)
  const [menuVisible, setMenuVisible] = useState(false)

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = ( begin ) => {
    setBegin(begin);
    showMode('date');
  };

  const showTimepicker = ( begin ) => {
    setBegin(begin);
    showMode('time');
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || (begin === true ? startDisplay : endDisplay)
    setShow(false);
    if (begin === true) {
      setStartDisplay(currentDate)
    } else {
      setEndDisplay(currentDate)
    }
    // console.log(timeToHumanDate(currentDate))
    // console.log(timeToHourMin(currentDate))
    console.log(dateExtract(new Date()))
    console.log(timeExtract(new Date()))
    console.log(new Date().toISOString())
  };


  
  const reducer = () => {
    const fixListItem = {
      name: name,
      startDate: dateExtract(startDisplay),
      startTime: timeExtract(startDisplay),
      endDate: dateExtract(endDisplay),
      endTime: timeExtract(endDisplay),
      recurring: recurring,
    };
  
    const flexListItem = {
      name: name,
      duration: hours * 60 + minutes,
      recurring: recurring,
    };

    console.log(hours * 60 + minutes)
  
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
<<<<<<< HEAD
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Task" />
        <Appbar.Action icon="delete" onPress={() => dispatch(removeTodo({type: type, key: item.key}))} />
      </Appbar.Header>
=======
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
>>>>>>> 28b23acd57e13a196a8f0052c911d8816ae6f624

      {/* Title Input */}
      <TextInput
        mode='flat'
        style={styles.title}
        placeholder='Add Title'
        dense={true}
        multiline={true}
        value={name}
        onChangeText={(text) => setName(text)}
        autoCapitalize="none"
        returnKeychild="done"
        blurOnSubmit={false}
      />
      <Divider style={styles.divider}></Divider>

      {/* Repeat Input */}
      <View style={styles.repeat}>
        <Icon style={{marginTop: 5, marginRight: 10, color:'#8c8c8c',}} name="redo" size={17} />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Pressable
                onPress={openMenu}
                style={
                  styles.wrapperCustom
                }
                android_ripple={{color: 'gray', borderless: false, borderRadius: 20}}
                >
                  <View style={{ flexDirection: 'row', borderRadius: 20}}>
                    <Text style={styles.subheading}>
                      {recurring}
                    </Text>
                  </View>
            </Pressable>
          }
        >
          <Menu.Item onPress={() => {
              setRecurring('Does not repeat')
              closeMenu.apply()
            }} title="Does not repeat" />
            <Menu.Item onPress={() => {
              setRecurring('Daily')
              closeMenu.apply()
            }} title="Daily" />
            <Menu.Item onPress={() => {
              setRecurring('Weekly')
              closeMenu.apply()
            }} title="Weekly" />
        </Menu>
      </View>
      <Divider style={styles.divider} />

      {/* Start Time and End Time */}
      {input.type === 'fixList' && (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 15}}>
          <Pressable onPress={() => showDatepicker(true)}>
            <View style={{flexDirection:'row'}}>
              <Icon style={{marginTop: 2, marginRight: 8, color:'#8c8c8c'}} name="calendar" size={20} />
              <Text style={styles.subheading}>{timeToHumanDate(startDisplay)}</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => showTimepicker(true)}>
            <Text style={styles.subheading}>{timeToHourMin(startDisplay)}</Text>
          </Pressable>
        </View>
      )}

      {input.type === 'fixList' && (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 15}}>
          <Pressable onPress={() => showDatepicker(false)}>
            <View style={{flexDirection:'row'}}>
              <Icon style={{marginTop: 2,marginRight: 8, color:'#8c8c8c'}} name="calendar-alt" size={20} />
              <Text style={styles.subheading}>{timeToHumanDate(endDisplay)}</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => showTimepicker(false)}>
            <Text style={styles.subheading}>{timeToHourMin(endDisplay)}</Text>
          </Pressable>
        </View>
      )}


      {/* Duration */}
      {input.type === 'flexList' && (
        <View style={{flexDirection: 'row', paddingHorizontal: 15, justifyContent:'space-between'}}>
        <View style={{flexDirection:'row', }}>
          <Icon style={{marginTop: 8, marginRight: 4, color:'#8c8c8c'}} name="clock" size={21} />
          <Text style={{paddingVertical: 6, paddingHorizontal: 5, fontSize: 16,}}>Duration</Text>  
        </View>
        <View style={{flexDirection:'row'}}>
          <TextInput
            mode='flat'
            style={styles.time}
            underlineColorAndroid='gray'
            placeholder='2'
            keyboardchild='numeric'
            value={hours}
            onChangeText={(number) => setHours(number)}
            autoCapitalize="none"
            blurOnSubmit={false}
          />
          <Text
            style={{
              fontSize: 18,
              marginRight: 5,
            }}
          >
            :
          </Text>
          <TextInput
            mode='flat'
            style={styles.time}
            underlineColorAndroid='gray'
            placeholder='30'
            keyboardchild='numeric'
            value={minutes}
            onChangeText={(number) => setMinutes(number)}
            autoCapitalize="none"
            blurOnSubmit={false}
          />
        </View>
      </View>
      )}

      {input.type === 'flexList' && (
        <View style={{flexDirection: 'row', justifyContent:'flex-end', paddingRight: 30,}}>
          <Text style={{color: '#8c8c8c'}}>hour</Text>
          <Text style={{color: '#8c8c8c'}}>       min</Text>
        </View>
      )}

      

      {show && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={ begin === true ? startDisplay : endDisplay }
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      <Button
        mode="contained"
        onPress={() => {
          reducer()
          navigation.goBack()
        }}
        style={{margin: 10, backgroundColor: '#85BEF9'}}
      >
        Add 
      </Button>
    </View>
    
  )
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  title: {
    width: 375,
    maxHeight: 120,
    fontSize: 26,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'white',
    fontFamily: 'sans-serif',
    fontWeight: '800',
  },
  divider: {
    marginVertical: 5,
    color: 'red'
  },
  repeat:{
    overflow: 'hidden',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  wrapperCustom: {
    borderRadius: 10,
    padding: 5,
    flexDirection: 'row',
  },
  subheading: {
    fontSize: 16,
  },
  time: {
    width: 44,
    height: 30,
    fontSize: 16,
    marginRight: 5,
    backgroundColor: 'white',
    fontFamily: 'sans-serif',
  },
  appbar: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
})