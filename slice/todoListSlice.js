import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'todoList',
    initialState: {
        count: 1,
        fixList: [{
            name: "chore (fixList)",
            start: "00:00",
            end: "00:00",
            key: 0,
        }, ],
        flexList: [{
          name: "chore (flexList)",
          start: "00:00",
          end: "00:00",
          key: 0,
      }, ],
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
        return {
          fixList: input.type == "fixList" ? [...(state.fixList),newItem] : state.fixList,
          flexList: input.type == "flexList" ? [...(state.flexList),newItem] : state.flexList,
          count: state.count + 1,
        };
      },
      removeTodo: (state, action) => {
        const input = action.payload;
        return {
          fixList: input.type == "fixList"
            ? state.fixList.filter((item) => item.key != input.key)
            : state.fixList,
          flexList: input.type == "flexList"
            ? state.flexList.filter((item) => item.key != input.key)
            : state.flexList,
          count: state.count,
        };
      },
      editTodo: (state, action) => {
        const input = action.payload;
        const newItem = {
          name: input.name,
          key: input.key,
          start: input.start,
          end: input.end,
        };
        return {
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
      },
    }
});

export const { addTodo, removeTodo, editTodo } = slice.actions;

export const selectTodoList = state => state.todoList;

export default slice.reducer;