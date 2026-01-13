import { createSlice } from '@reduxjs/toolkit';

interface UiState {
    isCartOpen: boolean;
    isCheckoutOpen: boolean;
}

const initialState: UiState = {
    isCartOpen: false,
    isCheckoutOpen: false,
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
        openCheckout: (state) => {
            state.isCheckoutOpen = true;
        },
        closeCheckout: (state) => {
            state.isCheckoutOpen = false;
        },
    },
});

export const { openCart, closeCart, toggleCart, openCheckout, closeCheckout } = uiSlice.actions;

export default uiSlice.reducer;
