import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable} from 'react-native';
import { Appbar, Button, Divider, Portal, Modal, RadioButton, TextInput } from 'react-native-paper'

import { useDispatch, useSelector } from 'react-redux';
import { selectSettings, editSettings } from '../slice/settingsSlice';

import RNDateTimePicker from '@react-native-community/datetimepicker';

import TaskSorter from '../TaskSorter';

import Authentication from '../api/Authentication';

const timeToHourMin = (time) => {
  const temp = new Date(time).toTimeString().split(' ')[0].split(':')
  return temp[0] + ':' + temp[1]
}


export default function SettingsScreen( { navigation } ) {
  const settings = useSelector(selectSettings)
  const dispatch = useDispatch();

  // const [startTime, setStartTime] = useState( new Date('December 17, 2021 08:00:00'))
  // const [cutoffTime, setCutoffTime] = useState( new Date('December 17, 2021 23:59:00'))
  const [startTime, setStartTime] = useState( new Date( 'December 17, 2021 ' + settings.startTime + ':00'))
  const [cutoffTime, setCutoffTime] = useState( new Date( 'December 17, 2021 ' + settings.cutoffTime + ':00'))
  // const [day, setDay] = useState('Same Day')
  const [day, setDay] = useState(settings.cutoffDay)

  /* states for time picker */
  const [mode, setMode] = useState('time')
  const [show, setShow] = useState(false)
  const [begin, setBegin] = useState(true)

  /* states for day selector */
  const [radioVisible, setRadioVisible] = useState(false)
  const showRadioModal = () => setRadioVisible(true)
  const hideRadioModal = () => setRadioVisible(false)

  /* states for duration selector */
  const [timeVisible, setTimeVisible] = useState(false)
  const showTimeModal = () => setTimeVisible(true)
  const hideTimeModal = () => setTimeVisible(false)

  /* Offset states */
  const [hours, setHours] = useState( (Math.floor(settings.offset / 60)).toString() )
  const [minutes, setMinutes] = useState( (settings.offset % 60).toString() )

  const [limitHrs, setLimitHrs] = useState( (Math.floor(settings.limit / 60)).toString() )
  const [limitMins, setLimitMins] = useState( (settings.limit % 60).toString() )
  const [timeType, setTimeType] = useState('offset')

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = ( begin ) => {
    setBegin(begin);
    showMode('time');
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || (begin === true ? startTime : cutoffTime)
    setShow(false)
    if (begin === true) {
      setStartTime(currentDate)
      dispatch(editSettings({type: 'startTime', newValue: timeToHourMin(currentDate)}))
    } else {
      setCutoffTime(currentDate)
      dispatch(editSettings({type: 'cutoffTime', newValue: timeToHourMin(currentDate)}))
      showRadioModal()
    }
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="Task Sorter" />
        <Appbar.Action icon="dots-vertical" onPress={() => console.log('More options')} />
      </Appbar.Header>
      <Text
        style={{color:'gray', paddingHorizontal: 30, paddingVertical: 10}}
      >
        Task Sorter Settings
      </Text>

      {/* Start Time */}
      <Pressable
        onPress ={() => showTimepicker(true)}
        android_ripple={{color: '#bababa'}}
        style={styles.press}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View>
            <Text style={styles.title}>Start Time</Text>
            <Text style={styles.subtitle}>Tasks only added after this time </Text>
          </View>
          <Text style={styles.value}>{timeToHourMin(startTime)}</Text>
        </View>
      </Pressable>
      
      {/* Cutoff Time */}
      <Pressable
        onPress ={() => showTimepicker(false)}
        android_ripple={{color: '#bababa'}}
        style={styles.press}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View>
            <Text style={styles.title}>Cutoff Time</Text>
            <Text style={styles.subtitle}>Tasks not added beyond this time </Text>
          </View>
          <Text style={styles.value}>{day + ', ' + timeToHourMin(cutoffTime)}</Text>
        </View>
      </Pressable>
      <Divider />

      {show && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={ begin === true ? startTime : cutoffTime }
          mode={mode}
          is24Hour={true}
          display='default'
          onChange={onChange}
        />
      )}

      <Portal>
        <Modal visible={radioVisible} onDismiss={hideRadioModal} contentContainerStyle={styles.modal}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 16, padding: 5}}> Next Day </Text>
            <RadioButton 
              value="Next Day"
              status={day === 'Next Day' ? 'checked' : 'unchecked'}
              onPress={() => {
                setDay('Next Day')
                dispatch(editSettings({type: 'cutoffDay', newValue: 'Next Day'}))
                hideRadioModal()
              }}
              />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 16, padding: 5}}> Same Day </Text>
            <RadioButton 
              value="Same Day"
              status={ day === 'Same Day' ? 'checked' : 'unchecked'}
              onPress={() => {
                setDay('Same Day')
                dispatch(editSettings({type: 'cutoffDay', newValue: 'Same Day'}))
                hideRadioModal()
              }}
            />
          </View>
        </Modal>
      </Portal>

      {/* Offset */}
      <Pressable
        onPress ={() => {
          setTimeType('offset')
          showTimeModal()
        }}
        android_ripple={{color: '#bababa'}}
        style={styles.press}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View>
            <Text style={styles.title}>Offset</Text>
            <Text style={styles.subtitle}>Break interval between tasks </Text>
          </View>
          <Text style={styles.value}>{hours + ' hrs ' + minutes + ' mins'}</Text>
        </View>
      </Pressable>
      <Divider />
      
      {/* Limit number of hours per day */}
      <Pressable
        onPress ={() => {
          setTimeType('limit')
          showTimeModal()
        }}
        android_ripple={{color: '#bababa'}}
        style={styles.press}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View>
            <Text style={styles.title}>Limit</Text>
            <Text style={styles.subtitle}>Max total task time per day</Text>
          </View>
          <Text style={styles.value}>{limitHrs + ' hrs ' + limitMins + ' mins'}</Text>
        </View>
      </Pressable>
      <Divider />

      <Portal>
        <Modal visible={timeVisible} onDismiss={hideTimeModal} contentContainerStyle={styles.modal}>
          <Text style={{fontSize: 20, marginBottom: 20, fontWeight: 'bold'}}> {timeType === 'offset' ? 'Offset Duration' : 'Max Duration limit'} </Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput 
              mode='flat'
              style={styles.time}
              underlineColorAndroid='gray'
              placeholder='1'
              keyboardType='numeric'
              value={timeType === 'offset' ? hours : limitHrs}
              onChangeText={(number) => timeType === 'offset' ? setHours(number) : setLimitHrs(number)}
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
              value={timeType === 'offset' ? minutes : limitMins}
              onChangeText={(number) => timeType === 'offset' ? setMinutes(number) : setLimitMins(number)}
              autoCapitalize="none"
              blurOnSubmit={false}
            />
            <Text style={styles.time}>mins</Text>
          </View>
          <Button
            mode="text"
            onPress={() => {
              if (timeType === 'offset') {
                dispatch(editSettings({type: 'offset', newValue: parseInt(hours) * 60 + parseInt(minutes)}))
                hideTimeModal()
              } else {
                dispatch(editSettings({type: 'limit', newValue: parseInt(limitHrs) * 60 + parseInt(limitMins)}))
                hideTimeModal()
              }
            }}
            style={{paddingTop: 10,}}
          >
            Save
          </Button>
        </Modal>
      </Portal>

      <TaskSorter />
      <Button
        mode='text'
        onPress={() => {
          Authentication( {action: "signOut", event: () => navigation.navigate("Home") })
        }}
        color='red'
        style={styles.button}
      >
        Sign out
      </Button>
    </View>  
  )
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      alignItems: 'stretch',
      backgroundColor: 'white',
    },
    title: {
      fontSize: 16,
      fontWeight:'900',
    },
    subtitle: {
      fontSize: 12,
      color: 'gray'
    },
    value: {
      fontSize: 16,
      color: '#2e2e2e',
      paddingTop: 5,
    },
    button: {
      width: 150,
      marginTop: 200,
      alignSelf:'flex-end',
    },
    press: {
      paddingHorizontal: 30,
      paddingVertical: 16,
    },
    modal: {
      backgroundColor: 'white',
      padding: 20,
      margin: 60,
    },
    time: {
      width: 44,
      height: 30,
      fontSize: 16,
      marginRight: 5,
      backgroundColor: 'white',
      fontFamily: 'sans-serif',
    },
  });