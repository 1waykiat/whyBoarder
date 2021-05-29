import { configureStore } from '@reduxjs/toolkit';
import todoListReducer from './todoList/todoListSlice';
import userInfoReducer from './userInfo/userInfoSlice';

export default configureStore({
    reducer: {
        todoList: todoListReducer,
        userInfo: userInfoReducer,
    },
});