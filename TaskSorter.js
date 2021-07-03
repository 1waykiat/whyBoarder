import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { addAgendaItem, selectTodoList } from "./slice/todoListSlice";
import { Button, Portal, Modal } from 'react-native-paper';
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

  const agendaSorter = (obj) => {
    const arr = Object.entries(obj);
    const sorted = arr.map((date) => {
      date[1] = [...date[1]].sort((x, y) => timeComparator(x, y));
      return date;
    });
    return Object.fromEntries(sorted);
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
  
  const [alertType, setAlertType] = useState('success')
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [failSortMessage, setFailSortMessage] = useState('');
  
  const sorterMessage = () => {
    switch(alertType) {
      case 'success':
        return 'Task succesfully added!';
      case 'alreadySorted':
        return 'Tasks already sorted!';
      case 'failToSort':
        return failSortMessage;
    }
  };

  function sort( { item, date } ) {
    const agendaDate = [...(agenda[date] == undefined ? [] : agenda[date])];
    const totalTime = agendaDate.reduce((sum, curr) => sum + agendaDuration(curr), 0);
    // day limit up
    if (totalTime > limit) return undefined;
    let startTime = stringToNumberTime(start);
    let endTime = addTime(startTime, item.duration);

    // for loop to iterate through agenda of the day
    for (let i = 0; i < agendaDate.length; i++) {
      const taskStartTime = stringToNumberTime(agendaDate[i].startTime);
      const taskEndTime = stringToNumberTime(agendaDate[i].endTime);

      // if end time tried is before next task with offset then end loop
      if (addTime(endTime, offset) <= taskStartTime) {
        break;
      } else {
        startTime = addTime(taskEndTime, offset); 
        endTime = addTime(startTime, item.duration);
      }
    }

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
      setAlertType('alreadySorted')
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
      setAlertType('failToSort');
      setFailSortMessage(failSort.reduce((prev, curr) => prev + '\n' + curr.name, 'This Task fail to be sorted:'));
    } else {
      setAlertType('success');
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
          <Text> { sorterMessage() } </Text>
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