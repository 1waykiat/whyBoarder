import { createSlice } from '@reduxjs/toolkit';
import Database from '../api/Database';

export const slice = createSlice({
    name: 'todoList',
    initialState: {
        count: 2,
        fixList: [{
            name: "example (fixList)",
            start: "00:00",
            end: "00:00",
            key: 0,
        }, ],
        flexList: [{
          name: "example (flexList)",
          start: "00:00",
          end: "00:00",
          key: 1,
        },],
    },
    reducers: {
      addTodo: (state, action) => {
        const input = action.payload;
        const newItem = {
          name: input.name,
          start: input.start,
          end: input.end,
          key: state.count,
        };
        const newState =  {
          fixList: input.type == "fixList" ? [...(state.fixList),newItem] : state.fixList,
          flexList: input.type == "flexList" ? [...(state.flexList),newItem] : state.flexList,
          count: state.count + 1,
        };
        Database( {action: "upload", data: newState} );
        return newState;
      },
      removeTodo: (state, action) => {
        const input = action.payload;
        const newState =  {
          fixList: input.type == "fixList"
            ? state.fixList.filter((item) => item.key != input.key)
            : state.fixList,
          flexList: input.type == "flexList"
            ? state.flexList.filter((item) => item.key != input.key)
            : state.flexList,
          count: state.count,
        };
        Database( {action: "upload", data: newState} );
        return newState;        
      },
      editTodo: (state, action) => {
        const input = action.payload;
        const newItem = {
          name: input.name,
          key: input.key,
          start: input.start,
          end: input.end,
        };
        const newState = {
          fixList: input.type == "fixList" 
            ? state.fixList.map((item) =>
              item.key == input.key ? newItem : item)
            : state.fixList,
          flexList: input.type == "flexList" 
            ? state.flexList.map((item) =>
              item.key == input.key ? newItem : item)
            : state.flexList,
          count: state.count,
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