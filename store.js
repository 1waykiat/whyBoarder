import { configureStore } from '@reduxjs/toolkit';
import todoListReducer from './slice/todoListSlice';
import userInfoReducer from './ignore/userInfo/userInfoSlice';

export default configureStore({
    reducer: {
        todoList: todoListReducer,
        userInfo: userInfoReducer,
    },
});