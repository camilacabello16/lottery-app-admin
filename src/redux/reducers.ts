// reducers.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './store';
import bleReducer from './bluetoothStore';
import counterReducer from './amountStore';
import rootApiReducer from './rootApiStore';

const rootReducer = combineReducers({
    auth: authReducer,
    bluetooth: bleReducer,
    counter: counterReducer,
    rootApi: rootApiReducer
});

export default rootReducer;