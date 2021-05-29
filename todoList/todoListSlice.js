import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'todoList',
    initialState: {
        count: 1,
        list: [{
            name: "chore",
            key: 0,
        }, ],
        
    },
    reducers: {
        addTodo: (state, action) => {
            const newState = {
                list: [
                    ...(state.list),
                    {
                        name: action.payload,
                        key: state.count,
                    }],
                count: state.count + 1,
            };
            return newState;
        },
        removeTodo: (state, action) => {
            const newState = {
                list: state.list.filter((item) => item.key != action.payload),
                count: state.count,
            };
            return newState;
        },
    }
});

export const { addTodo,removeTodo } = slice.actions;

export const selectTodoList = state => state.todoList.list;

export default slice.reducer;