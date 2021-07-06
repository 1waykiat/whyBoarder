import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { Button, Portal, Modal } from 'react-native-paper';

import { useDispatch, useSelector } from "react-redux";
import { addAgendaItem, agendaSorter, selectTodoList } from "./slice/todoListSlice";
import { selectSettings } from "./slice/settingsSlice";

import { stringToNumberTime, numberToStringTime, addTime, addDate, agendaDuration, today, timeComparator } from "./api/Time";

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
  const end = settings.cutoffTime;
  const limit = settings.limit;
  const offset = settings.offset;

  // remove task which is not possible to updated and 
  const checkLimit = (flexList) => {
    const tempFilter = (item) => {
      const duration = item.duration;
      const startToEnd = agendaDuration({ startTime: start, endTime: end });
      if (duration > startToEnd || duration > limit) {
        failSort.push(item);
        return false;
      }
      return true;
    };
    return flexList.filter(tempFilter);
  }
  
  const [alert, setAlert] = useState('');
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  
  const sorterMessage = ({ alertType, message }) => {
    switch(alertType) {
      case 'success':
        setAlert('Task succesfully added!');
      case 'alreadySorted':
        setAlert('Tasks already sorted!');
      case 'failToSort':
        setAlert(message);
    }
  };

  function sort( { item, date } ) {
    const agendaDate = [...(agenda[date] == undefined ? [] : agenda[date])];
    const totalTime = agendaDate.reduce((sum, curr) => sum + agendaDuration(curr), 0);
    // total hours of task for the day have already reached the limit set
    if (totalTime > limit) return undefined;
    
    let startTime = stringToNumberTime(start);
    let endTime = addTime(startTime, item.duration);

    let i = 0; // index of next agenda task
    let taskStartTime = getNumberTime({array: agendaDate, index: i, type: "startTime"}); 
    let taskEndTime = getNumberTime({array: agendaDate, index: i, type: "endTime"}); 
    
    let j = Math.floor(startTime / 600) + 1; // index of next possible preference time slot
    let preferenceStartTime = getNumberTime({array: preferenceArrray, index: j, type: start});
    
    //  loop to iterate through agenda of the day
    const preferenceArrray = [
      {startTime: "00:00", endTime: "05:59"},
      {startTime: "06:00", endTime: "11:59"},
      {startTime: "12:00", endTime: "17:59"},
      {startTime: "18:00", endTime: "23:59"},
    ]
    const checkPreference = ({startTime, endTime, preference}) => {
      return preference[Math.floor(startTime / 600)] && preference[Math.floor(endTime / 600)]
    };
    
    const getNumberTime = ({array, index, type}) => stringToNumberTime(array[index][type]);

    while (i < agendaDate.length) {
      // next agenda task start and end time
      
      if (!checkPreference({ startTime: startTime, endTime: endTime, preference: "preference" })) {
        if (preferenceStartTime < taskStartTime) {
          startTime = preferenceStartTime;
          j++;
          preferenceStartTime = stringToNumberTime(preferenceArrray[j].startTime);
        } else {
          startTime = addTime(taskEndTime, offset); 
          i++;
          taskStartTime = stringToNumberTime(agendaDate[i].startTime); 
          taskEndTime = stringToNumberTime(agendaDate[i].endTime); 
        }
        endTime = addTime(startTime, item.duration);
        continue;
      };
      
      // if end time tried is before next task with offset then end loop
      if (addTime(endTime, offset) <= taskStartTime) {
        break;
      } else {
        startTime = addTime(taskEndTime, offset); 
        endTime = addTime(startTime, item.duration);
        i++;
        taskStartTime = getNumberTime({array: agendaDate, index: i, type: "startTime"}); 
        taskEndTime = getNumberTime({array: agendaDate, index: i, type: "endTime"}); 
        j = Math.floor(startTime / 600);
      }
    }

    // for (let i = 0; i < agendaDate.length; i++) {
    //   const taskStartTime = stringToNumberTime(agendaDate[i].startTime);
    //   const taskEndTime = stringToNumberTime(agendaDate[i].endTime);

    //   // if end time tried is before next task with offset then end loop
    //   if (addTime(endTime, offset) <= taskStartTime) {
    //     break;
    //   } else {
    //     startTime = addTime(taskEndTime, offset); 
    //     endTime = addTime(startTime, item.duration);
    //   }
    // }

    let newAgendaItem = undefined;
    
    // if end before the cutoff time then add as new agenda
    if (endTime <= stringToNumberTime(end)) {
      newAgendaItem = {
        name: item.name,
        key: item.key,
        startTime: numberToStringTime(startTime),
        endTime: numberToStringTime(endTime),
      }
      
      agenda = updateAgenda(agenda, date, newAgendaItem);
      toUpdate.push([date, newAgendaItem]);
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
      <Button style={styles.button} icon="filter" mode="contained" onPress={() => sortAll()}>
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