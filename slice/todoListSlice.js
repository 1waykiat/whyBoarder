import { createSlice } from '@reduxjs/toolkit';
import Database from '../api/Database';

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
            recurring: true,
            key: 0,
        }, ],
        flexList: [{
          name: "example (flexList)",
          duration: "2:30",
          recurring: false,
          key: 1,
        },],
        agenda: {
          "2021-06-06": [{
            name: "Example (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-07": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-08": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-09": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-10": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-11": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-12": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-13": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-14": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-15": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-16": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-17": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-18": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
          "2021-06-19": [{
            name: "Example1 (Agenda)",
            startTime: "00:00",
            endTime: "01:00",
            key: 0,
          },],
        },
    },
    reducers: {
      addTodo: (state, action) => {
        const input = action.payload;
        const newItem = {...(input.newItem), key: state.count};
        const {startDate, endDate, recurring, ...newAgendaTask} = newItem;

        const newAgenda = input.type == "fixList"
        ? {
            ...(state.agenda),
            [input.newItem.startDate]: (state.agenda)[input.newItem.startDate] == undefined
              ? [newAgendaTask]
              : [...((state.agenda)[input.newItem.startDate]), newAgendaTask] 
          }
          : state.agenda;

        const newState =  {
          fixList: input.type == "fixList" ? [...(state.fixList), newItem] : [...state.fixList],
          flexList: input.type == "flexList" ? [...(state.flexList), newItem] : [...state.flexList],
          count: state.count + 1,
          agenda: Object.fromEntries(
            Object.entries(newAgenda)
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
      removeTodo: (state, action) => {
        const input = action.payload;
        const newState =  {
          fixList: input.type == "fixList"
            ? state.fixList.filter((item) => item.key != input.key)
            : [...state.fixList],
          flexList: input.type == "flexList"
            ? state.flexList.filter((item) => item.key != input.key)
            : [...state.flexList],
          count: state.count,
          agenda: Object.fromEntries(Object.entries(state.agenda).map((date) => {
            date[1] = date[1].filter((item) => item.key != input.key);
            return date;
          })),
        };
        Database( {action: "upload", data: newState} );
        return newState;        
      },
      editTodo: (state, action) => {  
        const input = action.payload;
        const {startDate, endDate, recurring, ...newAgenda} = {...(input.newItem)};
        const newState = {
          fixList: input.type == "fixList" 
            ? state.fixList.map((item) =>
              item.key == input.key ? input.newItem : item)
            : [...state.fixList],
          flexList: input.type == "flexList" 
            ? state.flexList.map((item) =>
              item.key == input.key ? input.newItem : item)
            : [...state.flexList],
          count: state.count,
          agenda: Object.fromEntries(Object.entries(state.agenda).map((date) => {
            date[1] = date[1].map((item) => item.key == input.key ? newAgenda : item);
            return date;
          })),
        };
        Database( {action: "upload", data: newState} );
        return newState;
      },
      downloadTodo: (state, action) => {
        const input = action.payload;
        return {
          ...input
        };
      }
    }
});

export const { addTodo, removeTodo, editTodo, downloadTodo } = slice.actions;

export const selectTodoList = state => state.todoList;

export default slice.reducer;