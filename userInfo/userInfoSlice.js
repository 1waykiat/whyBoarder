import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'userInfo',
    initialState: {
        user: {},
        signedIn: false,
        
    },
    reducers: {
        signIn: (state, action) => {
            return {
                user: action.payload,
                signedIn: true,
            }
        },
        signOut: (state, action) => {
            return {
                signedIn: false,
                user: {},
            }
        },
    }
});

export const { setName, signIn, signOut, } = slice.actions;

export const selectUserInfo= state => state.userInfo;

export default slice.reducer;