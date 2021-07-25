import React, {useState} from 'react'
import { Button, TextInput, Divider, Appbar, Portal, Modal, Switch, RadioButton } from 'react-native-paper'
import { Text, View, StyleSheet, Pressable, } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'
import { Feather } from '@expo/vector-icons';
import ColorPalette from 'react-native-color-palette'

import { useDispatch, useSelector } from 'react-redux';
import { addTodo, editTodo, removeTodo, selectTodoList } from '../slice/todoListSlice';

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
  const temp = time.toLocaleDateString().split('/');
  const temp1 = time.toLocaleString().split(" ")
  const result = temp1[temp1.length - 1]+"-"+temp[0].padStart(2, "0")+"-"+temp[1].padStart(2, "0");
  return result;
} 

// Converts to UTC HH:MM 

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
 if (task1.endDate == task2.startDate) {
  return task1.endTime > task2.startTime
} else if (task2.endDate == task1.startDate) {
  return task2.endTime > task1.startTime
} else if ( !(task1.endDate < task2.startDate || task2.endDate < task1.startDate) ) {
  return true
} else {
    const prelim = task1.startTime == task2.endTime || task1.endTime == task2.startTime
     const test1 = task1.endTime <= task2.startTime
     const test2 = task2.endTime <= task1.startTime
    return prelim ? false : !(test1 || test2)
  }
}

// **needs work 
const dateOverlap = (task1, task2) => {
  //return task1.startDate == task2.startDate
  const test1 = task1.endDate < task2.startDate
  const test2 = task2.endDate < task1.startDate

  return !(test1 || test2)  
}

function isNumeric(value) {
  return /^\d+$/.test(value);
}

export default function EditScreen( { navigation, route } ) {
  const input = route.params;
  const item = input.item;
  const todoList = input.type == "fixList" ? useSelector(selectTodoList).fixList : useSelector(selectTodoList).flexList
  
  const dispatch = useDispatch();

  const [name, setName] = useState(item == undefined ? "" : item.name);

  const [recurring, setRecurring] = useState(item == undefined ? "Does not repeat" : item.recurring);
  const [recurVisible, setRecurVisible] = useState(false)
  const showRecurModal = () => setRecurVisible(true)
  const hideRecurModal = () => setRecurVisible(false)

  const [hours, setHours] = useState(item == undefined ? "1" : Math.floor(item.duration / 60).toString());
  const [minutes, setMinutes] = useState(item == undefined ? "0" : (item.duration % 60).toString());
  const [durVisible, setDurVisible] = useState(false)
  const showDurModal = () => setDurVisible(true)
  const hideDurModal = () => setDurVisible(false)

  const [startDisplay, setStartDisplay] = useState(item == undefined  ? new Date() : dateTimeMerge(item.startDate, item.startTime) )
  const [endDisplay, setEndDisplay] = useState(item == undefined  ? new Date() : dateTimeMerge(item.endDate, item.endTime) )
  
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [begin, setBegin] = useState(true)

  const [prefVisible, setPrefVisible] = useState(false)
  const showPrefModal = () => setPrefVisible(true)
  const hidePrefModal = () => setPrefVisible(false)
  
  const [pm, setPm] = useState(item == undefined  || item.timePreference == undefined ? true : item.timePreference[0])
  const onTogglePm = () => setPm(!pm)
  const [morn, setMorn] = useState(item == undefined  || item.timePreference == undefined ? true : item.timePreference[1])
  const onToggleMorn = () => setMorn(!morn)
  const [noon, setNoon] = useState(item == undefined  || item.timePreference == undefined ? true : item.timePreference[2])
  const onToggleNoon = () => setNoon(!noon)
  const [eve, setEve] = useState(item == undefined  || item.timePreference == undefined ? true : item.timePreference[3])
  const onToggleEve = () => setEve(!eve)

  const [priority, setPriority] = useState(item == undefined ? false : item.priority)
  const togglePriority = () => setPriority(!priority)

  // For the color modal, not be thrown into reducer, purely for Color palette
  const [color, setColor] = useState('#277DA1')
  const [colorVisible, setColorVisible] = useState(false)
  const toggleColor = () => setColorVisible(!colorVisible)
  const dismissColor = () => setColorVisible(false)
  // ACTUAL value to be thrown into the reducer
  const [colorSelected, setColorSelected] = useState(item == undefined ? '#277DA1' : item.color )

  const [snackVisible, setSnackVisible] = useState(false)
  const toggleSnack = () => setSnackVisible(!snackVisible)
  const dismissSnack = () => setSnackVisible(false)
  const overlapAlert = "Duration overlaps with an existing task!"

  const [deleteVisible, setDeleteVisible] = useState(false)
  const toggleDelete = () => setDeleteVisible(!deleteVisible)
  const dismissDelete = () => setDeleteVisible(false)

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
      setStartDisplay(currentDate);
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
        color: colorSelected,
    }};
  
    const flexListItem = () => {
      return {
        name: name,
        duration: parseInt(hours) * 60 + parseInt(minutes),
        timePreference: [pm, morn, noon, eve],
        priority: priority,
        color: colorSelected,
    }};

    const newItem = () => input.type == "fixList" ? fixListItem() : flexListItem();
    

    // Error checking area
    if (input.type == "fixList") {
      if(item == undefined) {
        if(todoList.filter( (task) => dateOverlap(newItem(), task)).filter( (task) => timeOverlap(newItem(), task)).length > 0) {
            console.log('ERROR: Task input time interval overlaps with existing task in FixList')
            toggleSnack()
            return 
          } 
      } else {
        if(todoList.filter( (task) => task.key != item.key)
        .filter( (task) => dateOverlap(newItem(), task))
        .filter( (task) => timeOverlap(newItem(), task))
        .length > 0) {
          console.log('ERROR: Task input time interval overlaps with existing task in FixList')
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
      <View>
        <Appbar.Header style={{backgroundColor: 'white'}}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={item == undefined ? 'Add Task' : 'Edit Task'} />
          { item != undefined && (
            <Appbar.Action icon="delete" onPress={toggleDelete} />
          )}
          <Appbar.Action icon='circle' onPress={toggleColor} color={colorSelected} style={{}} />

          {input.type === "flexList" && (
            <Appbar.Action icon={ priority ? "star" : "star-outline" } onPress={togglePriority} />
          )}
          <Appbar.Action 
            icon="check" 
            onPress={() => { reducer() }} 
            disabled={ input.type === 'fixList' && endDisplay <= startDisplay
            || (endDisplay - startDisplay) / 3600000 > 24 && recurring == 'Daily'
            || (endDisplay - startDisplay) / 3600000 > 168 && recurring == 'Weekly' } />
        </Appbar.Header>

        <Portal>
          <Modal visible={deleteVisible} onDismiss={dismissDelete} contentContainerStyle={styles.modal} dismissable={false}>
            <Text style={{fontSize: 15}}>
              Delete the existing task?
            </Text>
            <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:20 }}>
              <Button mode='text' onPress={dismissDelete} labelStyle={{fontSize: 12}}>
                Cancel
              </Button>
              <Button mode="text" onPress={() => {
                dispatch(removeTodo({key: item.key}));
                dismissDelete()
                navigation.goBack()
              }}
              labelStyle={{fontSize: 12}}
              >        
                Delete    
              </Button>
            </View>
          </Modal>
        </Portal>

        {/* Title Input */}
        <TextInput
          mode='flat'
          style={styles.taskName}
          placeholder='Add Title'
          dense={true}
          multiline={true}
          value={name}
          onChangeText={(text) => setName(text)}
          autoCapitalize="none"
          returnKeychild="done"
          blurOnSubmit={false}
          underlineColor='transparent'
        />
        <Divider />

        {/* Recurring */}
        {input.type === 'fixList' && (
          <Pressable
            onPress ={showRecurModal}
            android_ripple={{color: '#bababa'}}
            style={styles.pressIcon}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
                <Icon style={{marginTop: 4, marginRight: 10, color:'#8c8c8c',}} name="redo" size={17} />
                <Text style={styles.title}>Recurrence</Text>
              </View>
              <Text style={styles.title}>{recurring}</Text>
            </View>
          </Pressable>
        )}
        {input.type === 'fixList' && (
          <Divider />
        )}

        <Portal>
          <Modal visible={recurVisible} onDismiss={hideRecurModal} contentContainerStyle={styles.modal} >
            <RadioButton.Group onValueChange={recur => setRecurring(recur)} value={recurring}>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding: 4}}>
                <Text style={{marginTop: 5, fontSize: 16}}>Does not repeat</Text>
                <RadioButton value="Does not repeat" />
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding: 4}}>
                <Text style={{marginTop: 5, fontSize: 16}}>Daily</Text>
                <RadioButton value="Daily" />
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding: 4}}>
                <Text style={{marginTop: 5, fontSize: 16}}>Weekly</Text>
                <RadioButton value="Weekly" />
              </View>
            </RadioButton.Group>
          </Modal>
        </Portal>

        {/* Start Time and End Time */}
        {input.type === 'fixList' && (
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18}}>
            <Pressable onPress={() => showDatepicker(true)}>
              <View style={{flexDirection:'row'}}>
                <Icon style={{marginTop: 2, marginRight: 10, color:'#8c8c8c'}} name="calendar" size={20} />
                <Text style={ {fontSize: 16, color: endDisplay <= startDisplay ? 'red' : 'black', marginRight: 6,}}>
                  {timeToHumanDate(startDisplay)}
                </Text>
              </View>
            </Pressable>

            <Pressable onPress={() => showTimepicker(true)}>
            <Text style={ {fontSize: 16, color: endDisplay <= startDisplay ? 'red' : 'black', marginRight: 6,}}>
                {timeToHourMin(startDisplay)}
              </Text>
            </Pressable>
          </View>
        )}

        {input.type === 'fixList' && (
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18}}>
            <Pressable onPress={() => showDatepicker(false)} >
              <View style={{flexDirection:'row'}}>
                <Icon style={{marginTop: 2,marginRight: 10, color:'#8c8c8c'}} name="calendar-alt" size={20} />
                <Text style={styles.subheading}>
                  {timeToHumanDate(endDisplay)}
                </Text>
              </View>
            </Pressable>

            <Pressable onPress={() => showTimepicker(false)}>
              <Text style={styles.subheading}>
                {timeToHourMin(endDisplay)}
              </Text>
            </Pressable>
          </View>
        )}


        {/* Duration */}
        { input.type === 'flexList' && (
          <Pressable
            onPress ={showDurModal}
            android_ripple={{color: '#bababa'}}
            style={styles.pressIcon}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
                <Icon style={{marginTop: 3, marginRight: 8, color:'#8c8c8c'}} name="clock" size={20} />
                <Text style={styles.title}>Duration</Text>
              </View>
              <Text style={styles.title}>{hours + ' hr ' + minutes + ' min'}</Text>
            </View>
          </Pressable>
        )}
        <Divider />

        <Portal>
          <Modal visible={durVisible} onDismiss={hideDurModal} contentContainerStyle={styles.modal} dismissable={false}>
            <View style={{flexDirection: 'row', justifyContent:'center'}}>
              <TextInput 
                mode='flat'
                style={styles.time}
                underlineColorAndroid='gray'
                placeholder='1'
                keyboardType='numeric'
                value={hours}
                onChangeText={(number) => setHours(number) }
                autoCapitalize="none"
                blurOnSubmit={false}
              />
              <Text style={styles.time}>hrs</Text>
              <TextInput
                mode='flat'
                style={styles.time}
                underlineColorAndroid='gray'
                placeholder='30'
                keyboardType='numeric'
                value={minutes}
                onChangeText={(number) => setMinutes(number)}
                autoCapitalize="none"
                blurOnSubmit={false}
              />
              <Text style={styles.time}>mins</Text>
            </View>

            <View style={{flexDirection:'row', justifyContent: 'center'}} >
              {((hours === "" || minutes === "") 
                || hours < 0 || minutes < 0 || (hours === '0' && minutes === '0') 
                || minutes > 59
                || !(isNumeric(hours) && isNumeric(minutes))) && (
                  <Feather name='alert-triangle' size={20} color="red" style={{paddingHorizontal: 6}} />
                )}

              <Text style={{alignSelf: 'center', color: 'red'}}>
                { (hours === "" || minutes === "")
                  ? "Please input in duration"
                  : !(isNumeric(hours) && isNumeric(minutes))
                  ? "Only positive numeric digits allowed"
                  : (hours === '0' && minutes === '0') 
                  ? "Duration should be above 0" 
                  : minutes > 59
                  ? "Mins should be less than 60!"
                  : ""
                }
              </Text>
            </View>
          
            <Button
              mode="text"
              onPress={hideDurModal}
              style={{paddingTop: 10,}}
              disabled={((hours === "" || minutes === "")
              || (!(isNumeric(hours) && isNumeric(minutes))) 
              || (hours === '0' && minutes === '0') 
              || minutes > 59)}
            >
              Save
            </Button>
          </Modal>
        </Portal>


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

        {/* Time Preference */}
        {input.type === 'flexList' && (
          <Pressable
            onPress ={showPrefModal}
            android_ripple={{color: '#bababa'}}
            style={styles.press}>
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <Text style={styles.title}>Time Preference</Text>
                  <Text style={styles.subtitle}>Time period to insert task</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginVertical: 8}}>
                {pm && (
                  <Feather name="moon" size={20} color="black" />
                )}
                {morn && (
                  <Feather name="sunrise" size={20} color="black" />
                )}
                {noon && (
                  <Feather name="sun" size={20} color="black" />
                )}
                {eve && (
                  <Feather name="sunset" size={20} color="black" />
                )}
              </View>
            </View>
          </Pressable>
        )}

        {/* Time preference Modal selection */}
        <Portal>
          <Modal visible={prefVisible} onDismiss={hidePrefModal} contentContainerStyle={styles.modal} dismissable={false}>
            <View style={{flexDirection:'row', justifyContent: 'space-between', paddingVertical: 10,}}>
              <View style={{flexDirection:'row'}}>
                <Feather name="moon" size={20} color="black" style={{marginRight: 6, marginVertical: 1,}} />
                <Text>Night</Text>
              </View>
              <Switch value={pm} onValueChange={onTogglePm} />
            </View>
            <View style={{flexDirection:'row', justifyContent: 'space-between', paddingVertical: 10,}}>
              <View style={{flexDirection:'row'}}>
                <Feather name="sunrise" size={20} color="black" style={{marginRight: 6, marginVertical: 1,}} />
                <Text>Morning</Text>
              </View>
              <Switch value={morn} onValueChange={onToggleMorn} />
            </View>
            <View style={{flexDirection:'row', justifyContent: 'space-between', paddingVertical: 10,}}>
              <View style={{flexDirection:'row'}}>
                <Feather name="sun" size={20} color="black" style={{marginRight: 6, marginVertical: 1,}} />
                <Text>Afternoon</Text>
              </View>
              <Switch value={noon} onValueChange={onToggleNoon} />
            </View>
            <View style={{flexDirection:'row', justifyContent: 'space-between', paddingVertical: 10,}}>
              <View style={{flexDirection:'row'}}>
                <Feather name="sunset" size={20} color="black" style={{marginRight: 6, marginVertical: 1,}} />
                <Text>Evening</Text>
              </View>
              <Switch value={eve} onValueChange={onToggleEve} />
            </View>


            <View style={{flexDirection: 'row', justifyContent:'center'}}>
              {!(pm || morn || noon || eve) && (
                <Feather name='alert-triangle' size={20} color="red" style={{paddingHorizontal: 6}} />
              )}
              <Text style={{alignSelf: 'center', color: 'red'}}>
                {!(pm || morn || noon || eve) ? "No time period chosen!" : ""}
              </Text>
            </View>

            <Button mode='text' onPress={hidePrefModal}
              style={{marginHorizontal: 10, marginVertical: 5, }}
              disabled={!(pm || morn || noon || eve)}
              >
              Save
            </Button>
          </Modal>
        </Portal>
        

        
        { ( input.type === 'fixList' && endDisplay <= startDisplay 
          || (endDisplay - startDisplay) / 3600000 > 24 && recurring == 'Daily'
          || (endDisplay - startDisplay) / 3600000 > 168 && recurring == 'Weekly') && (
          <View style={{flexDirection:'row', justifyContent: 'center', padding: 10}}>
            <Feather name='alert-triangle' size={20} color="red" style={{paddingHorizontal: 6}} />
            <Text style={{color: 'red'}}>
              {endDisplay < startDisplay ? "Start time cannot be after the End Time."
              : (endDisplay - startDisplay) / 3600000 > 24 && recurring == 'Daily'
              ? "Daily tasks should not be longer than 24hrs."
              : (endDisplay - startDisplay) / 3600000 > 168 && recurring == 'Weekly'
              ? "Weekly tasks should not be longer than a week."
              : "Start time cannot be same as End Time."}
            </Text>
          </View>
        )}

        <Portal>
          <Modal visible={colorVisible} onDismiss={dismissColor} contentContainerStyle={styles.modal} dismissable={true} >
            <ColorPalette 
              onChange={color => setColor(color)}
              value={color}
              colors={['#f94144', '#277DA1', '#577590', '#4D908E', '#43AA8B', '#F3722C', '#90BE6D', '#F9C74F', '#F8961E']}
              title="Color Theme"
              icon={<Icon name={'check'} size={14} color={'white'}  />}
            />
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Button 
                mode="text"
                onPress={() => {
                  dismissColor()
                  setColor(colorSelected)
                }}
                style={{marginHorizontal: 0, marginTop: 10, }}
              >
                Cancel
              </Button>
              <Button 
                mode="text" 
                onPress={() => {
                  setColorSelected(color)
                  dismissColor()
                }} style={{marginHorizontal: 0, marginTop: 10, }}>
                Save
              </Button>
            </View>
          </Modal>
        </Portal>


      </View>


      {/* Error notification */}
      <Portal>
        <Modal visible={snackVisible} onDismiss={dismissSnack} contentContainerStyle={styles.modal} >
          <Text>
            {overlapAlert}
          </Text>
          <Button mode="text" onPress={dismissSnack} >
            ok
          </Button>
        </Modal>
      </Portal>

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  taskName: {
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
    color: 'black',
    marginRight: 6,
  },
  time: {
    width: 44,
    height: 30,
    fontSize: 16,
    marginRight: 5,
    marginVertical: 10,
    backgroundColor: 'white',
    fontFamily: 'sans-serif',
  },
  appbar: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 16,
    fontWeight:'900',
  },
  subtitle: {
    fontSize: 12,
    color: '#bababa'
  },
  press: {
    paddingLeft: 47,
    paddingRight: 28,
    paddingVertical: 16,
  },
  pressIcon: {
    paddingLeft: 20,
    paddingRight: 28,
    paddingVertical: 22,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 60,
    borderRadius: 10,
  },
})
