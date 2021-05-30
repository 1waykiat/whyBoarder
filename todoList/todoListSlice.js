import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'todoList',
    initialState: {
        count: 1,
        list: [{
            name: "chore",
            start: "00:00",
            end: "00:00",
            key: 0,
        }, ],
        
    },
    reducers: {
      addTodo: (state, action) => {
        const input = action.payload;
        return {
          list: [
            ...(state.list),
            {
              name: input.name,
              start: input.start,
              end: input.end,
              key: state.count,
            }],
          count: state.count + 1,
        };
      },
      removeTodo: (state, action) => {
        return {
          list: state.list.filter((item) => item.key != action.payload),
          count: state.count,
        };
      },
      editTodo: (state, action) => {
        const input = action.payload;
        return {
          list: state.list.map((item) => {
            if (item.key == input.key) {
              return {
                name: input.name,
                key: item.key,
                start: input.start,
                end: input.end,
                
              }
            }
          }),
          count: state.count,
        };
      }
    }
});

export const { addTodo, removeTodo, editTodo } = slice.actions;

export const selectTodoList = state => state.todoList.list;

export default slice.reducer;