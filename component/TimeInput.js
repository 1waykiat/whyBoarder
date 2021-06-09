import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native'

import { TextInput, Divider, Menu, Button} from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome5'
import RNDateTimePicker from '@react-native-community/datetimepicker';

import { useDispatch } from 'react-redux'
import { addTodo } from '../slice/todoListSlice'

const timeToHumanDate = (time) => {
  const temp = new Date(time).toDateString().split(' ')
  return temp[0] + ', ' + temp[2] + ' ' + temp[1] + ' ' + temp[3]
}

const timeToHourMin = (time) => {
  const temp = new Date(time).toTimeString().split(' ')[0].split(':')
  return temp[0] + ':' + temp[1]
}

const TimeInput = ( child ) => {
  {/* Redux stuff */}
  const dispatch = useDispatch()
  const add = () => {
    dispatch(addTodo({
    type: child.type,
    name: title,
    start: timeToHourMin(startTime),
    end: timeToHourMin(endTime)
  }))
    child.event.apply()
  }

  {/* title state */}
  const [title, setTitle] = useState('')

  {/* Duration state */}
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')

  {/* Repeat state */}
  const [repeat, setRepeat] = useState('Does not repeat')
  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)
  const [menuVisible, setMenuVisible] = useState(false)
  
  {/* Start/End Time states */}
  const [startTime, setStartTime] = useState( new Date() )
  const [endTime, setEndTime] = useState( new Date() )

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [begin, setBegin] = useState(true)

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
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    if (begin === true) {
      setStartTime(currentDate)
    } else {
      setEndTime(currentDate)
    }
    console.log(timeToHumanDate(currentDate))
    console.log(timeToHourMin(currentDate))
  };

  return(
    <View>
      <Text style={styles.header}>Add a Task</Text>
      {/* Title Input */}
      <TextInput 
        mode= 'flat'
        style={styles.title}
        underlineColor='white'
        placeholder='Add Title'
        value={title}
        onChangeText={(text) => setTitle(text)}
        autoCapitalize="none"
        returnKeychild="done"
        blurOnSubmit={false}
      />
      <Divider style={styles.divider}/>


      {/* Time and Repeat Input */}
      <View style={{flexDirection: 'row', justifyContent:'flex-start'}}>
        <Icon style={{marginTop: 8, marginRight: 3, color:'#8c8c8c'}} name="clock" size={21} />
        <TextInput
          mode='flat'
          style={styles.time}
          underlineColorAndroid='gray'
          placeholder='12'
          keyboardchild='numeric'
          value={hours}
          onChangeText={(number) => setHours(number)}
          autoCapitalize="none"
          blurOnSubmit={false}
        />
        <Text
          style={{
            fontSize: 22,
            marginRight: 5,
          }}
        >
          :
        </Text>
        <TextInput
          mode='flat'
          style={styles.time}
          underlineColorAndroid='gray'
          placeholder='00'
          keyboardchild='numeric'
          value={minutes}
          onChangeText={(number) => setMinutes(number)}
          autoCapitalize="none"
          blurOnSubmit={false}
        />
        <View style={styles.repeat}>
          <Menu 
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Pressable
                onPress={openMenu}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? 'rgb(210, 230, 255)'
                      : 'white'
                  },
                  styles.wrapperCustom
                ]}
                android_ripple={{color: 'gray', borderless: true}}
                >
                  <View style={{width: 150, flexDirection:'row',}}>
                    <Icon style={{marginTop: 5, marginRight: 10, color:'#8c8c8c', marginLeft: 0}} name="redo" size={17} />
                    <Text style={{marginTop: 2, fontSize: 15}}>
                      {repeat}
                    </Text>
                  </View>
            </Pressable>
            }
          >
            <Menu.Item onPress={() => {
              setRepeat('Does not repeat')
              closeMenu.apply()
            }} title="Does not repeat" />
            <Menu.Item onPress={() => {
              setRepeat('Daily')
              closeMenu.apply()
            }} title="Daily" />
            <Menu.Item onPress={() => {
              setRepeat('Weekly')
              closeMenu.apply()
            }} title="Weekly" />
          </Menu>
        </View>
      </View>

      {/* Labelling of hour and min for time input */}
      <View style={{flexDirection: 'row', justifyContent:'flex-start', paddingLeft: 13}}>
        <Text style={{color: '#8c8c8c'}}>      hour       </Text>
        <Text style={{color: '#8c8c8c', paddingBottom: 10}}>  min</Text>
      </View>

      <Divider />


        
      {/* Start Time and End Time */}
      {child.type === 'fixList' && (
      <Pressable onPress={() => console.log("why")}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, paddingVertical: 10}}>
          <Pressable onPress={() => showDatepicker(true)}>
            <View style={{flexDirection:'row'}}>
              <Icon style={{marginTop: 2,marginRight: 8, color:'#8c8c8c'}} name="calendar" size={20} />
              <Text style={styles.subheading}>{timeToHumanDate(startTime)}</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => showTimepicker(true)}>
            <Text style={styles.subheading}>{timeToHourMin(startTime)}</Text>
          </Pressable>
        </View>
      </Pressable>
      )}

      {child.type === 'fixList' && (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, paddingVertical: 10}}>
        <Pressable onPress={() => showDatepicker(false)}>
          <View style={{flexDirection:'row'}}>
            <Icon style={{marginTop: 2,marginRight: 8, color:'#8c8c8c'}} name="calendar-alt" size={20} />
            <Text style={styles.subheading}>{timeToHumanDate(endTime)}</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => showTimepicker(false)}>
          <Text style={styles.subheading}>{timeToHourMin(endTime)}</Text>
        </Pressable>
      </View>
      )}


      {show && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={ begin === true ? startTime : endTime }
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
  

      {/* Adding task button */}
      <Button mode="contained" onPress={add} style={{marginTop: 10}}> Add Task </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
  },
  header:{
    width: 350,
    height: 50,
    fontSize: 24,
    marginBottom: 5,
    backgroundColor: 'white',
    fontFamily: 'sans-serif',
    fontWeight: 'bold'
  },
  title: {
    width: 350,
    height: 50,
    fontSize: 22,
    marginBottom: 2,
    backgroundColor: 'white',
    fontFamily: 'sans-serif',
    fontWeight: '800'
  },
  time: {
    width: 48,
    height: 35,
    fontSize: 20,
    marginRight: 5,
    backgroundColor: 'white',
    fontFamily: 'sans-serif',
  },
  divider: {
    marginBottom: 10,
  },
  repeat:{
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 0,
    flexDirection: 'row',
    marginLeft: 40,
    marginTop: 0,
  },
  wrapperCustom: {
    borderRadius: 5,
    padding: 5,
    flexDirection: 'row',
  },
  subheading: {
    fontSize: 16,
  },
})

export default TimeInput