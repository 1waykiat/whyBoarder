import { createSlice } from '@reduxjs/toolkit';
import Database from '../api/Database';
import { addDate, timeComparator, dateComparator, dateDifference, today } from '../api/Time';


// fixList sorter by date then time
const fixListSorter = (arr) => {
  const sorted = arr.sort((x, y) => {
    const dc = dateComparator(x, y)
    return dc != 0 ? dc : timeComparator(x, y);
  })
  return sorted;
};

// agenda sorter by time
const agendaSorter = (obj) => {
  const arr = Object.entries(obj);
  const sorted = arr.map((date) => {
    date[1] = date[1].sort((x, y) => timeComparator(x, y));
    return date;
  });
  return Object.fromEntries(sorted);
};

// flexList sorter by duration descending order
const flexListSorter = (arr) => {
  const sorted = arr.sort((x, y) => {
    return y.duration - x. duration
  })
  return sorted;
}

const newAgendaAdder = ({ agenda, type, date, newAgendaTask }) => type == "fixList"
  ? {...(agenda),
      [date]: (agenda)[date] == undefined
        ? [newAgendaTask]
        : [...(agenda[date]), newAgendaTask] 
    }
  : {...agenda};

// agenda adder which take into account multiple days and recurrence
const multiDayAdder = ({ agenda, type, startDate, endDate, newAgendaTask }) => {
  if (type != "fixList") return {...agenda}
  let tempAgenda = agenda;
  let currentDate = startDate;
  let recurrence;
  let interval;
  switch (newAgendaTask.recurring) {
    case "Does not repeat": 
      recurrence = 1;
      interval = 0;
      break;
    case "Daily": 
      recurrence = 14;
      interval = 1;
      break;
    case "Weekly":
      recurrence = 8;
      interval = 7;
      break;
  }

  for (let i = 0; i < recurrence; i++) {
    while (true) {
      tempAgenda = newAgendaAdder({
        agenda: tempAgenda,
        type: type,
        date: currentDate,
        newAgendaTask: {
          ...newAgendaTask,
          startTime: currentDate == startDate ? newAgendaTask.startTime : "00:00",
          endTime: currentDate == endDate ? newAgendaTask.endTime : "23:59",
        }
      })
  
      if (currentDate == endDate) break;
      currentDate = addDate(currentDate, 1);
    }
    startDate = addDate(startDate, interval);
    endDate = addDate(endDate, interval);
    currentDate = startDate;
  }

  return tempAgenda;
}

// to cleanup agenda as a final step to ensure all arrays are not converted to array-like object
export const cleanupAgenda = (agenda) => Object.fromEntries(
  Object.entries(agendaSorter({...agenda}))
  .filter((date) => date[1].length != 0)
  .map((date) => {
    date[1] = [...date[1]];
    return date;
  })
);

const removeAgenda = ({agenda, key}) => Object.fromEntries(Object.entries({...agenda}).map((date) => {
  date[1] = date[1].filter((item) => item.key != key);
  return date;
}));

const upload = (data) => Database( {action: "upload", slice: "todoList", data: data} );

export const slice = createSlice({
  name: 'todoList',
  initialState: {
    count: 2,
    fixList: [{
        name: "example (fixList)",
        startDate: "2021-06-06",
        startTime: "00:00",
        endDate: "2021-06-06",
        endTime: "01:00",
        recurring: "Does not repeat",
        key: 0,
    }, ],
    flexList: [{
      name: "example (flexList)",
      duration: 240,
      recurring: "Does not repeat",
      key: 1,
    }, ],
    agenda: {
      "2021-06-06": [{
        name: "example (fixList)",
        startTime: "00:00",
        endTime: "01:00",
        key: 0,
      },],
    },
  },
  reducers: {
    // input is object with type and new item
    addTodo: (state, action) => {
      const input = action.payload;
      // complete new task object with key
      const newItem = {...(input.newItem), key: state.count};
      // extract new Agenda Object to be added to new Agenda
      const {startDate, endDate, ...newAgendaTask} = newItem;

      // add in new task if Fix List to Agenda without cleanup

      const newAgenda = multiDayAdder({
        agenda: state.agenda,
        type: input.type,
        recurring: input.newItem.recurring,
        startDate: input.newItem.startDate,
        endDate: input.newItem.endDate, 
        newAgendaTask: newAgendaTask
      });

      const newState =  {
        fixList: fixListSorter(input.type == "fixList" ? [...(state.fixList), newItem] : [...state.fixList]),
        flexList: flexListSorter(input.type == "flexList" ? [...(state.flexList), newItem] : [...state.flexList]),
        count: state.count + 1,
        // take new Agenda Object and remove dates which have no task and to ensure no Array-like Object instead of Array
        agenda: cleanupAgenda(newAgenda),
      };
      upload(newState);
      return newState;
    },
    
    // remove item with key
    removeTodo: (state, action) => {
      const input = action.payload;
      const newState =  {
        ...state,
        fixList: fixListSorter(state.fixList.filter((item) => item.key != input.key)),
        flexList: flexListSorter(state.flexList.filter((item) => item.key != input.key)),
        agenda: removeAgenda({agenda: state.agenda, key: input.key}),
      };
      upload(newState);
      return newState;
    },

    // input is object with key, type and new item including key
    editTodo: (state, action) => {
      const input = action.payload;
      const {startDate, endDate, ...newAgendaTask} = {...(input.newItem)};
      
      // remove task first
      let newAgenda = removeAgenda({agenda: state.agenda, key: input.key});

      // add back the edited task
      newAgenda = multiDayAdder({
        agenda: newAgenda,
        type: input.type,
        recurring: input.newItem.recurring,
        startDate: input.newItem.startDate,
        endDate: input.newItem.endDate, 
        newAgendaTask: newAgendaTask
      });

      const newState = {
        ...state,
        fixList: fixListSorter(input.type == "fixList"
          ? state.fixList.map((item) =>
            item.key == input.key ? input.newItem : item)
          : [...state.fixList]),
        flexList: flexListSorter(input.type == "flexList"
          ? state.flexList.map((item) =>
            item.key == input.key ? input.newItem : item)
          : [...state.flexList]),
        agenda: cleanupAgenda(newAgenda),
      };
      upload(newState);
      return newState;
    },

    // input is updated state object
    downloadTodo: (state, action) => {
      const input = action.payload;
      return {
        ...input
      };
    },

    // give date and agenda item to be added
    addAgendaItem: (state, action) => {
      const input = action.payload;

      const newAgenda = newAgendaAdder({
        agenda: state.agenda,
        type: "fixList",
        date: input.date,
        newAgendaTask: input.newItem,
      })

      const newState = {
        ...state,
        fixList: [...state.fixList],
        flexList: [...state.flexList],
        agenda: cleanupAgenda(newAgenda),
      }
      upload(newState);
      return newState;
    },
    
    clearTodo: (state, action) => {
      const input = action.payload;
      const removedList = state[input.type];
      let newAgenda = {...(state.agenda)};

      for (let i = 0; i < removedList.length; i++) {
        newAgenda = Object.fromEntries(Object.entries(newAgenda).map((date) => {
          date[1] = date[1].filter((item) => item.key != removedList[i].key);
          return date;
        }));
      }

      const newState = {
        ...state,
        agenda: cleanupAgenda(newAgenda),
        [input.type]: [],
      };
      upload(newState);
      return newState;
    },
    // provide current date
    updateRecurring: (state, action) => {
      const updateDate = action.payload;
      const tdy = today();
      console.log(tdy + " " + updateDate);
      // already up to date, no need for any check
      if (updateDate == tdy) return {...state};
      const recurringFixList = [...state.fixList].filter((item) => item.recurring != "Does not repeat");
      let newAgenda = {...state.agenda}

      for (let i = 0; i < recurringFixList.length; i++) {
        const curr = recurringFixList[i];
        let sDate;
        const numberOfDays = dateDifference(curr);
        const {startDate, endDate, ...newAgendaTask} = {...curr};
      
        // loop through agenda object
        for (const date in newAgenda) {
          if (dateComparator(date, tdy) > 0) break;
          if (dateComparator(updateDate, date) >= 0) continue;
          
          for (const task of newAgenda[date]) {
            if (task.key == curr.key) {
              sDate = date;
              break;
            }
          }
          // if earliest matching agenda is already found then exit loop
          if (sDate != undefined) break;
        }

        // if not found, then there is no need to update this recurring task
        if (sDate == undefined) continue;

        const newStartDate = addDate(sDate, curr.recurring == "Daily" ? 1 : 7);
        const newEndDate = addDate(newStartDate, numberOfDays);

        // remove the task first, then add back the task with new Start Date
        newAgenda = removeAgenda({agenda: newAgenda, key: curr.key});
        newAgenda = multiDayAdder({
          agenda: newAgenda,
          type: "fixList",
          startDate: newStartDate,
          endDate: newEndDate,
          newAgendaTask: newAgendaTask,
        });
      }

      const newState = {
        ...state,
        agenda: cleanupAgenda(newAgenda),
      };
      upload(newState);
      Database( {action: "upload", slice: "updateDate", data: today()} )
      return newState;
    },
  }	
});

export const { addTodo, removeTodo, editTodo, downloadTodo, addAgendaItem, clearTodo, updateRecurring } = slice.actions;

export const selectTodoList = state => state.todoList;

export default slice.reducer;