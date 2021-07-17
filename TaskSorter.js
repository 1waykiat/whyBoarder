import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { Button, Portal, Modal } from 'react-native-paper';

import { useDispatch, useSelector } from "react-redux";
import { addAgendaItem, agendaSorter, selectTodoList } from "./slice/todoListSlice";
import { selectSettings } from "./slice/settingsSlice";

import { stringToNumberTime, numberToStringTime, addTime, addDate, agendaDuration, today, } from "./api/Time";

// local update of agenda
const updateAgenda = (agenda, date, newItem) => {
  const newAgenda = {
    ...(agenda),
    [date]: (agenda)[date] == undefined
      ? [newItem]
      : [...((agenda)[date]), newItem]
  };
  
  return Object.fromEntries(
    Object.entries(agendaSorter(newAgenda))
    .filter((date) => date[1].length != 0)
    .map((date) => {
      date[1] = [...date[1]];
      return date;
    })
    );
  }
  
  const checkAdded = (flexList, agenda) => {
    const tempFilter = (item) => {
      for(const date in agenda) {
        for (const task of agenda[date]) {
          if (item.key == task.key) return false;
        }
      }
      return true;
    }
    return flexList.filter(tempFilter);
  };
  
  const preferenceArrray = [
    {startTime: "00:00", endTime: "05:59"},
    {startTime: "06:00", endTime: "11:59"},
    {startTime: "12:00", endTime: "17:59"},
    {startTime: "18:00", endTime: "23:59"},
    {startTime: "24:00", endTime: "29:59"},
    {startTime: "30:00", endTime: "35:59"},
    {startTime: "36:00", endTime: "41:59"},
    {startTime: "42:00", endTime: "47:59"},
  ];

  const checkPreference = ({startTime, endTime, preference}) => {
    const startIndex = Math.floor((typeof startTime == "string" ? stringToNumberTime(startTime) : startTime) / 600);
    const endIndex = Math.floor((typeof endTime == "string" ? stringToNumberTime(endTime) : endTime) / 600);
    return preference[startIndex % 4] && preference[endIndex % 4];
  };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function TaskSorter() {
  // current date
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const state = useSelector(selectTodoList);

  let agenda = {...(state.agenda)};
  let toUpdate =[];
  let failSort = [];
  const start  = settings.startTime;
  const end = settings.cuttoffDay == "Same Day"
    ? settings.cutoffTime
    : numberToStringTime(addTime(settings.cutoffTime, 24 * 60));
  const limit = settings.limit;
  const offset = settings.offset;

  // remove task which is not possible to updated and 
  const checkLimit = (flexList) => {
    const tempFilter = (item) => {
      const duration = item.duration;
      const preference = item.timePreference;
      const startToEnd = agendaDuration({ startTime: start, endTime: end });

      const preferenceLimit = () => {
        if (checkPreference({startTime: start, endTime: addTime(start, duration), preference: preference})) return true;
        let j = settings.cuttoffDay == "Same Day" ? Math.ceil(stringToNumberTime(start) / 600) : 0;

        while (j < 4) {
          const preferenceStartTime = preferenceArrray[j].startTime;
          const preferenceEndTime = addTime(preferenceStartTime, duration);
          if (preferenceEndTime > end) return false
          if (checkPreference({startTime: preferenceStartTime, endTime: preferenceEndTime, preference: preference})) return true;
          j++;
        }
        return false;
      };

      if (duration > startToEnd || duration > limit || !preferenceLimit()) {
        failSort.push(item);
        return false;
      }
      return true;
    };
    return flexList.filter(tempFilter);
  }
  
  const [alert, setAlert] = useState('');
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  
  const sorterMessage = ({ alertType, message }) => {
    switch(alertType) {
      case 'success':
        setAlert('Task succesfully added!');
        break;
        case 'alreadySorted':
          setAlert('Tasks already sorted!');
          break;
          case 'failToSort':
            setAlert(message);
            break;
      }
  };
    
  function sort( { item, date } ) {
    const agendaDate = [...(agenda[date] == undefined ? [] : agenda[date])];
    const agendaNextDate = [...(agenda[addDate(date, 1)] == undefined ? [] : agenda[addDate(date, 1)])];
    agendaDate.push(...(agendaNextDate.map((item) => {
      return {...item,
        startTime: numberToStringTime(addTime(item.startTime, 24 * 60)),
        endTime: numberToStringTime(addTime(item.endTime, 24 * 60)),
      }
    })));
    const totalTime = agendaDate.reduce((sum, curr) => sum + agendaDuration(curr), 0);
    // total hours of task for the day have already reached the limit set
    if (totalTime > limit) return undefined;
    
    let startTime = stringToNumberTime(start);
    let endTime = addTime(startTime, item.duration);

    let i = 0; // index of next agenda task
    while (i < agendaDate.length) {
      if (startTime <= stringToNumberTime(agendaDate[i].startTime)) break;
      i++
    }
    let j = Math.ceil(startTime / 600); // index of next possible preference time slot
    
    //  loop to iterate through agenda of the day
    while (i < agendaDate.length || j < 7) {
      // next agenda task start and end time
      const taskStartTime = i < agendaDate.length ? stringToNumberTime(agendaDate[i].startTime) : Infinity;
      const taskEndTime = i < agendaDate.length ? stringToNumberTime(agendaDate[i].endTime) : Infinity;
      const preferenceStartTime = j < 7 ? stringToNumberTime(preferenceArrray[j].startTime) : Infinity;

      if (!checkPreference({ startTime: startTime, endTime: endTime, preference: item.timePreference })) {
        if (preferenceStartTime < taskStartTime) {
          startTime = preferenceStartTime;
          j++;
        } else {
          startTime = addTime(taskEndTime, offset); 
          i++;
          j = Math.ceil(startTime / 600);
        }
        endTime = addTime(startTime, item.duration);
        continue;
      }
      
      // if end time tried is before next task with offset then end loop
      if (addTime(endTime, offset) <= taskStartTime) {
        break;
      } else {
        startTime = addTime(taskEndTime, offset); 
        endTime = addTime(startTime, item.duration);
        i++;
        j = Math.ceil(startTime / 600);
      }
    }
    
    let newAgendaItem = undefined;
    
    // if end before the cutoff time then add as new agenda
    if (endTime <= stringToNumberTime(end) && 
      checkPreference({ startTime: startTime, endTime: endTime, preference: item.timePreference })) {
      newAgendaItem = {
        name: item.name,
        key: item.key,
        color: item.color,
        startTime: numberToStringTime(startTime < 2400 ? startTime : addTime(startTime, -24 * 60)),
        endTime: numberToStringTime(endTime < 2400 ? endTime : addTime(endTime, -24 * 60)),
      }
      
      // check for overnight task
      if (startTime < 2400 && endTime >= 2400) {
        newAgendaItem1 = {...newAgendaItem, endTime: "23:59"};
        newAgendaItem2 = {...newAgendaItem, startTime: "00:00"};
        agenda = updateAgenda(agenda, date, newAgendaItem1);
        agenda = updateAgenda(agenda, addDate(date, 1), newAgendaItem2);
        toUpdate.push([date, newAgendaItem1]);
        toUpdate.push([addDate(date, 1), newAgendaItem2]);
      } else {
        agenda = updateAgenda(agenda, startTime < 2400 ? date : addDate(date, 1), newAgendaItem);
        toUpdate.push([startTime < 2400 ? date : addDate(date, 1), newAgendaItem]);
      }
    }
    
    return newAgendaItem;
  }
  
  function sortAll() {
    const flexList = checkLimit(checkAdded([...(state.flexList == undefined ? [] : state.flexList)], agenda));
    if (flexList.length == 0 && failSort.length == 0) {
      sorterMessage({ alertType: 'alreadySorted' })
      showModal()
      return;
    }

    for (let i = 0; i < flexList.length; i++) {
      let date = today();
      let result = undefined;
      
      while (true) {
        result = sort( { item: flexList[i], date: date } );
        if (result != undefined) break; 
        date = addDate(date, 1);
      }
    }

    for (let j = 0; j < toUpdate.length; j++) {
      dispatch(addAgendaItem( { date: toUpdate[j][0], newItem: toUpdate[j][1] } ));
    }
    
    if (failSort.length != 0) {
      sorterMessage({
        alertType: 'failToSort',
        message: failSort.reduce((prev, curr) => prev + '\n' + curr.name, 'This Task fail to be sorted:'),
      });
    } else {
      sorterMessage({ alertType: 'success' });
    } 

    showModal()
    failSort = [];
    toUpdate = [];
  }
  
  return (
    <View>
      <Button style={styles.button} contentStyle={{backgroundColor:'#277DA1'}} icon="filter" mode="contained" onPress={() => sortAll()}>
        Sort my Tasks!
      </Button>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
          <Text> {alert} </Text>
          <Button mode='text' onPress={() => hideModal()} labelStyle={{fontSize: 12,}} style={{alignSelf: 'flex-end'}}>
            Dismiss
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 30,
    marginVertical: 30,
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 50,
  }
})