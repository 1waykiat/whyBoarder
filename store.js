import { configureStore } from '@reduxjs/toolkit';
import todoListReducer from './slice/todoListSlice';
import settingsReducer from './slice/settingsSlice';

export default configureStore({
    reducer: {
        todoList: todoListReducer,
        settings: settingsReducer,
    },
});