import React from 'react'
import { TouchableOpacity, Text, View, Alert } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { addAgendaItem, selectTodoList } from "./slice/todoListSlice";

// compare two task by time
const stringToNumberTime = (timeString) => {
  return parseInt(timeString.substring(0, 2) + timeString.substring(3, 5));
  };

const numberToStringTime = (timeNumber) => {
  const temp = timeNumber.toString().padStart(4,"0");
  return temp.substring(0, 2) + ":" + temp.substring(2, 4);
}


// take time in number format and return in number format e.g (0930) not ("09:30")
const addTime = (time, duration) => {
  const mins = (duration % 60 + time % 100) % 60;
  const hours = Math.floor(duration / 60) + Math.floor((duration % 60 + time % 100) / 60)
  return (Math.floor(time / 100) + hours) * 100 + mins;
};

// take a date (e.g "2021-06-16") and an interger number of days to get the date after that number of days
const addDate = (dateString, numberOfDays) => {
  let nextDate = new Date(dateString)
  nextDate.setDate(nextDate.getDate() + numberOfDays);
  return nextDate.toISOString().split('T')[0];
}


// local update of agenda
const updateAgenda = (agenda, date, newItem) => {
  const newAgenda = {
    ...(agenda),
    [date]: (agenda)[date] == undefined
      ? [newItem]
      : [...((agenda)[date]), newItem]
  };

  const timeComparator = (x, y) => {
    return parseInt(x.startTime.substring(0, 2) + x.startTime.substring(3, 5)) -
      parseInt(y.startTime.substring(0, 2) + y.startTime.substring(3, 5));
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
  const checkAgenda = (item) => {
    for(const date in agenda) {
      for (const task of agenda[date]) {
        if (item.key == task.key) return false;
      }
    }
    return true;
  }
  return flexList.filter(checkAgenda);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function TaskSorter() {
  // current date
  const today = (new Date(Date.now())).toISOString().split("T")[0];
  const dispatch = useDispatch();
  const state = useSelector(selectTodoList);
  let agenda = {...(state.agenda)};
  let toUpdate =[];

  function sort( { item, date, offset = 0 } ) {
    console.log(offset);
    const agendaDate = [...(agenda[date] == undefined ? [] : agenda[date])];
    let startTime = stringToNumberTime("08:00");
    let endTime = addTime(startTime, item.duration);

    // for loop to iterate through agenda of the day
    for (let i = 0; i < agendaDate.length; i++) {
      console.log(i+ ": "+ startTime+ " " + endTime);
      const taskStartTime = stringToNumberTime(agendaDate[i].startTime);
      const taskEndTime = stringToNumberTime(agendaDate[i].endTime);

      if (endTime + offset <= taskStartTime) {
        break;
      } else {
        startTime = taskEndTime + offset;
        endTime = addTime(startTime, item.duration);
      }
    }

    endTime = endTime > 2359 ? 2359 : endTime;

    let newAgendaItem = undefined;

    
    if (startTime != endTime) {
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
    const flexList = checkAdded([...(state.flexList == undefined ? [] : state.flexList)], agenda);
    if (flexList.length == 0) {
      Alert.alert("All sorted");
      return;
    }

    for (let i = 0; i < flexList.length; i++) {
      let date = today;
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
    toUpdate = [];
  }

  return (
      <TouchableOpacity
        onPress={() => {
          sortAll();
        }}
        >
        <Text>Sort</Text>
      </TouchableOpacity>
  );
}