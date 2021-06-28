import React, {useState} from 'react'
import { Text, Button, TextInput, Divider, Appbar, Menu, Snackbar } from 'react-native-paper'
import { View, StyleSheet, Pressable, } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'

import { useDispatch, useSelector } from 'react-redux';
import { addTodo, editTodo, removeTodo, selectTodoList } from '../slice/todoListSlice';

import RNDateTimePicker from '@react-native-community/datetimepicker';

// Converts to local readable DATE
const timeToHumanDate = (time) => {
  const temp = new Date(time).toDateString().split(' ')
  return temp[0] + ', ' + temp[2] + ' ' + temp[1] + ' ' + temp[3]
}

// to solve a bug that may or may not exist
const testConvert = (time) => {
  const day = time.getDate()
  const month = time.getMonth() + 1
  const year = time.getFullYear() 

  return year + '-' + month.toString().padStart(2, '0') + '-' + day
}

// Converts to local readable TIME
const timeToHourMin = (time) => {
  const temp = new Date(time).toTimeString().split(' ')[0].split(':')
  return temp[0] + ':' + temp[1]
}

// Converts to UTC YYYY-MM-DD 
const dateExtract = (time) => {
  const temp = time.toLocaleDateString().split('/');
  const result = time.toLocaleString().split(" ")[4]+"-"+temp[0].padStart(2, "0")+"-"+temp[1].padStart(2, "0");
  return result;
} 

// Converts to UTC HH:MM 
const timeExtract = (time) => {
  const temp = new Date(time).toISOString().split('T')[1].split(":")
  return temp[0] + ':' + temp[1]
}

// Merges both the YYYY-MM-DD and HH:MM to return Date object
const dateTimeMerge = (date, time) => {
  if (date != undefined) {
    const dateArray = date.split("-");
    return new Date(new Date(dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0] + " " + time + ":00").toUTCString());
  }
  return new Date();
}

// Check if time period of two fixed tasks overlap, return true if so.
const timeOverlap = (task1, task2) => {
  const prelim = task1.startTime == task2.endTime || task1.endTime == task2.startTime
   const test1 = task1.endTime <= task2.startTime
   const test2 = task2.endTime <= task1.startTime
  // console.log("Task1 startTime: " + task1.startTime , "Task2.startTime: " + task2.startTime)
  // console.log("Task1 endTime: " + task1.endTime , "Task2.endTime: " + task2.endTime)
  return prelim ? false : !(test1 || test2)
}

// **needs work 
const dateOverlap = (task1, task2) => {
  return task1.startDate == task2.startDate
}

const validDuration = (task) => {
  return task.startTime <= task.endTime && task.startTime != task.endTime
}

export default function EditScreen( { navigation, route } ) {
  const input = route.params;
  const item = input.item;

  const todoList = input.type == "fixList" ? useSelector(selectTodoList).fixList : useSelector(selectTodoList).flexList

  const [name, setName] = useState(item == undefined ? "" : item.name);
  const [hours, setHours] = useState(item == undefined ? "" : Math.floor(item.duration / 60).toString());
  const [minutes, setMinutes] = useState(item == undefined ? "" : (item.duration % 60).toString());
  const [recurring, setRecurring] = useState(item == undefined ? "Does not repeat" : item.recurring);
  const dispatch = useDispatch();

  const [startDisplay, setStartDisplay] = useState(item == undefined  ? new Date() : dateTimeMerge(item.startDate, item.startTime) )
  const [endDisplay, setEndDisplay] = useState(item == undefined  ? new Date() : dateTimeMerge(item.endDate, item.endTime) )
  
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [begin, setBegin] = useState(true)

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)
  const [menuVisible, setMenuVisible] = useState(false)

  const [snackVisible, setSnackVisible] = useState(false)
  const toggleSnack = () => setSnackVisible(!snackVisible)
  const dismissSnack = () => setSnackVisible(false)
  const [alertType, setAlertType] = useState('')
  const overlapAlert = "Duration overlaps with an existing task!"
  const earlyEndAlert = "Invalid time duration set!"

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
  };


  const reducer = () => {
    const fixListItem = () => {
      return {
        name: name,
        startDate: dateExtract(startDisplay),
        startTime: timeToHourMin(startDisplay),
        endDate: dateExtract(endDisplay),
        endTime: timeToHourMin(endDisplay),
        recurring: recurring,
    }};
  
    const flexListItem = () => {
      return {
        name: name,
        duration: parseInt(hours) * 60 + parseInt(minutes),
        recurring: recurring,
    }};

    const newItem = () => input.type == "fixList" ? fixListItem() : flexListItem();
    

    // Error checking area
    if (input.type == "fixList") {
      if(!validDuration(newItem())) {
        console.log('ERROR: Invalid time duration set!')
        setAlertType('invalid')
        toggleSnack()
        return
      }

      if(item == undefined) {
        if(todoList.filter( (task) => dateOverlap(newItem(), task)).filter( (task) => timeOverlap(newItem(), task)).length > 0) {
            console.log('ERROR: Task input time interval overlaps with existing task in FixList')
            setAlertType('overlap')
            toggleSnack()
            return 
          } 
      } else {
        if(todoList.filter( (task) => task.key != item.key)
        .filter( (task) => dateOverlap(newItem(), task))
        .filter( (task) => timeOverlap(newItem(), task))
        .length > 0) {
          console.log('ERROR: Task input time interval overlaps with existing task in FixList')
          setAlertType('overlap')
          toggleSnack()
          return
        }
      }
    }
      

    if (item == undefined) {
      navigation.goBack()
      return dispatch(addTodo( {
        type: input.type,
        newItem: newItem(),
      } ));
    } else {  
      navigation.goBack()
      return dispatch(editTodo( {
        type: input.type,
        key: item.key,
        newItem: {...newItem(), key: item.key},
      } ));
    }
  };

  return(
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Task" />
        <Appbar.Action icon="delete" onPress={() => {
          dispatch(removeTodo({key: item.key}));
          navigation.goBack();
        }} />
      </Appbar.Header>

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
            keyboardType='numeric'
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

      <Snackbar
        visible={snackVisible}
        onDismiss={dismissSnack}
        duration={5000}
      >
        {alertType == "overlap"
          ? overlapAlert
          : alertType == 'invalid'
          ? earlyEndAlert
          : 'smth is wrong'}
      </Snackbar>

      <Button
        mode="contained"
        onPress={() => {
          reducer()
        }}
        style={{margin: 10, backgroundColor: '#85BEF9'}}
      >
        {item == undefined ? "Add" : "Edit"} 
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
