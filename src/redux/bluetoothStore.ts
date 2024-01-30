import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Device } from 'react-native-ble-plx';

interface DevicesState {
    devices: Device[];
    selectedDevice: Device | null;
}

const initialState: DevicesState = {
    devices: [],
    selectedDevice: null,
};

const devicesSlice = createSlice({
    name: 'devices',
    initialState,
    reducers: {
        addDevice: (state, action: PayloadAction<Device>) => {
            if (state.devices.length > 0) {
                state.devices[0] = action.payload;
            } else {
                state.devices.push(action.payload);
            }
        },
        removeDevice: (state) => {
            state.devices = [];
        }
    },
});

export const { addDevice, removeDevice } = devicesSlice.actions;

export default devicesSlice.reducer;