// store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state interface
interface AuthState {
  isLoggedIn: boolean;
  userData: {
    username: string;
    access_token: string;
    staff_id: string;
    // Add other user data as needed
  } | null;
}

// Define the initial state
const initialState: AuthState = {
  isLoggedIn: false,
  userData: null,
};

// Create a slice for the authentication state
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; access_token: string }>) => {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
    },
  },
});

// Export the actions from the slice
export const { login, logout } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;