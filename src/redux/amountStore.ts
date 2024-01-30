import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
    value: number;
    numberTicket: number;
    type: string; //DIENTOAN, VIETLOT_VETHUONG, KENO
}

interface CounterArrayState {
    counters: CounterState[];
}

const initialState: CounterArrayState = {
    counters: []
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        incrementByAmount: (state, action: PayloadAction<CounterState>) => {
            var check = state.counters.find(o => o.type == action.payload.type);
            if (check) {
                var index = state.counters.indexOf(check);
                state.counters[index].value += action.payload.value;
                state.counters[index].numberTicket++;
            } else {
                state.counters.push(action.payload);
            }
        },
        resetValue: (state) => {
            state.counters = [];
        }
    },
});

export const { incrementByAmount, resetValue } = counterSlice.actions;
export default counterSlice.reducer;