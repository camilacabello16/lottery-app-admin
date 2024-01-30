// store.ts
import { createSlice } from '@reduxjs/toolkit';

const pro = 'https://api.veso3mien.vn';
const dev = 'https://dev.veso3mien.vn';

// Define the initial state
const initialState = {
    rootApi: pro
};

// Create a slice for the authentication state
const authSlice = createSlice({
    name: 'rootApi',
    initialState,
    reducers: {
        switchRootApi: (state) => {
            if (state.rootApi == pro) state.rootApi = dev;
            else state.rootApi = pro;

            console.log(state.rootApi);

        }
    },
});

// Export the actions from the slice
export const { switchRootApi } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;