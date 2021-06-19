import { createSlice } from '@reduxjs/toolkit';
import Database from '../api/Database';

// compare two task by time
const timeComparator = (x, y) => {
  return parseInt(x.startTime.substring(0, 2) + x.startTime.substring(3, 5)) -
    parseInt(y.startTime.substring(0, 2) + y.startTime.substring(3, 5));
};

// compare two task by date
const dateComparator = (x, y) => {
  return new Date(x.startDate) - new Date(y.startDate);
};

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

const flexListSorter = (arr) => {
  const sorted = arr.sort((x, y) => {
    return y.duration - x. duration
  })
  return sorted;
}


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
        },],
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
        const {startDate, endDate, recurring, ...newAgendaTask} = newItem;

        // add in new task if Fix List to Agenda without cleanup
        const newAgenda = input.type == "fixList"
        ? {
            ...(state.agenda),
            [input.newItem.startDate]: (state.agenda)[input.newItem.startDate] == undefined
              ? [newAgendaTask]
              : [...((state.agenda)[input.newItem.startDate]), newAgendaTask] 
          }
          : state.agenda;

        const newState =  {
          fixList: fixListSorter(input.type == "fixList" ? [...(state.fixList), newItem] : [...state.fixList]),
          flexList: flexListSorter(input.type == "flexList" ? [...(state.flexList), newItem] : [...state.flexList]),
          count: state.count + 1,
          // take new Agenda Object and remove dates which have no task and to ensure no Array-like Object instead of Array
          agenda: Object.fromEntries(
            Object.entries(agendaSorter(newAgenda))
            .filter((date) => date[1].length != 0)
            .map((date) => {
               date[1] = [...date[1]];
              return date;
            })
          ),
        };
        Database( {action: "upload", data: newState} );
        return newState;
      },
      
      // remove item with key
      removeTodo: (state, action) => {
        const input = action.payload;
        const newState =  {
          fixList: fixListSorter(state.fixList.filter((item) => item.key != input.key)),
          flexList: flexListSorter(state.flexList.filter((item) => item.key != input.key)),
          count: state.count,
          agenda: Object.fromEntries(Object.entries(state.agenda).map((date) => {
            date[1] = date[1].filter((item) => item.key != input.key);
            return date;
          })),
        };
        Database( {action: "upload", data: newState} );
        return newState;
      },

			// input is object with key, type and new item including key
      editTodo: (state, action) => {
        const input = action.payload;
        const {startDate, endDate, recurring, ...newAgendaTask} = {...(input.newItem)};
        
        let newAgenda = Object.fromEntries(Object.entries(state.agenda).map((date) => {
          date[1] = date[1].filter((item) => item.key != input.key);
          return date;
        }));

        newAgenda = input.type == "fixList"
          ? {
            ...(newAgenda),
            [input.newItem.startDate]: (newAgenda)[input.newItem.startDate] == undefined
              ? [newAgendaTask]
              : [...((newAgenda)[input.newItem.startDate]), newAgendaTask] 
          }
          : newAgenda;

        const newState = {
          fixList: fixListSorter(input.type == "fixList"
            ? state.fixList.map((item) =>
              item.key == input.key ? input.newItem : item)
            : [...state.fixList]),
          flexList: flexListSorter(input.type == "flexList"
            ? state.flexList.map((item) =>
              item.key == input.key ? input.newItem : item)
            : [...state.flexList]),
          count: state.count,
          agenda: Object.fromEntries(
            Object.entries(agendaSorter(newAgenda))
            .filter((date) => date[1].length != 0)
            .map((date) => {
               date[1] = [...date[1]];
              return date;
            })
          ),
        };
        Database( {action: "upload", data: newState} );
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
				const newAgenda = {
					...(state.agenda),
					[input.date]: (state.agenda)[input.date] == undefined
						? [input.newItem]
						: [...((state.agenda)[input.date]), input.newItem]
        };
				const newState = {
          fixList: [...state.fixList],
          flexList: [...state.flexList],
					agenda: Object.fromEntries(
            Object.entries(agendaSorter(newAgenda))
            .filter((date) => date[1].length != 0)
            .map((date) => {
              date[1] = [...date[1]];
              return date;
            })
          ),
          count: state.count,
				}
				Database( {action: "upload", data: newState} );
        return newState;
			}
    }	
});

export const { addTodo, removeTodo, editTodo, downloadTodo, addAgendaItem } = slice.actions;

export const selectTodoList = state => state.todoList;

export default slice.reducer;