import { configureStore } from '@reduxjs/toolkit';
import todoListReducer from './slice/todoListSlice';


export default configureStore({
    reducer: {
        todoList: todoListReducer,
    },
});