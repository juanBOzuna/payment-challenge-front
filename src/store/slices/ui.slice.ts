import { createSlice } from '@reduxjs/toolkit';

interface UiState {
    isCartOpen: boolean;
}

const initialState: UiState = {
    isCartOpen: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openCart: (state) => {
            state.isCartOpen = true;
        },
        closeCart: (state) => {
            state.isCartOpen = false;
        },
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
    },
});

export const { openCart, closeCart, toggleCart } = uiSlice.actions;

export default uiSlice.reducer;
