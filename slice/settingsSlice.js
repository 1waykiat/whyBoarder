import { createSlice } from '@reduxjs/toolkit';
import Database from '../api/Database';

export const slice = createSlice({
  name: 'taskSorterSettings',
  initialState: {
    startTime: "08:00",
    cutoffTime: "23:59",
    cutoffDay: "Same Day",
    // in mins
    offset: 30,
    limit: 8 * 60,
  },
  reducers: {
    editStartTime: (state, action) => {
      const input = action.payload
      const newState = {
        startTime: input,
        cutoffTime: state.cutoffTime,
        cutoffDay: state.cutoffDay,
        offset: state.offset,
        limit: state.limit,
      }
      Database( {action: "upload", data: newState} )
      return newState
    },
    editCutoffTime: (state, action) => {
      const input = action.payload
      const newState = {
        startTime: state.startTime,
        cutoffTime: input,
        cutoffDay: state.cutoffDay,
        offset: state.offset,
        limit: state.limit,
      }
      Database( {action: "upload", data: newState} )
      return newState
    },
    editCutoffDay: (state, action) => {
      const input = action.payload
      const newState = {
        startTime: state.startTime,
        cutoffTime: state.cutoffTime,
        cutoffDay: input,
        offset: state.offset,
        limit: state.limit,
      }
      Database( {action: "upload", data: newState} )
      return newState
    },
    editOffset: (state, action) => {
      const input = action.payload
      const newState = {
        startTime: state.startTime,
        cutoffTime: state.cutoffTime,
        cutoffDay: state.cutoffDay,
        offset: input,
        limit: state.limit,
      }
      Database( {action: "upload", data: newState} )
      return newState
    },
    editLimit: (state, action) => {
      const input = action.payload
      const newState = {
        startTime: state.startTime,
        cutoffTime: state.cutoffTime,
        cutoffDay: state.cutoffDay,
        offset: state.offset,
        limit: input
      }
      Database( {action: "upload", data: newState} )
      return newState
    },
  }
})

export const {editStartTime, editCutoffTime, editCutoffDay, editOffset, editLimit} = slice.actions

export const selectSettings = state => state.taskSorterSettings

export default slice.reducer;