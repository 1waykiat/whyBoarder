import { createSlice } from '@reduxjs/toolkit';
import Database from '../api/Database';

export const slice = createSlice({
  name: 'taskSorterSettings',
  initialState: {
    startTime: "09:00",
    cutoffTime: "23:59",
    cutoffDay: "Same Day",
    // in mins
    offset: 30,
    limit: 8 * 60,
  },
  reducers: {
    editSettings: (state, action) => {
      const input = action.payload
      const newState = {
        ...state,
        [input.type]: input.newValue
      }
      return newState
    },
  }
})

export const { editSettings } = slice.actions

export const selectSettings = state => state.settings

export default slice.reducer;