import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    id: string; // Product ID
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    totalAmount: number;
    itemCount: number;
}

const initialState: CartState = {
    items: [],
    totalAmount: 0,
    itemCount: 0,
};

const calculateTotals = (items: CartItem[]) => {
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { totalAmount, itemCount };
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ id: string; name: string; price: number; imageUrl: string; quantity?: number }>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            const quantityToAdd = action.payload.quantity || 1;

            if (existingItem) {
                existingItem.quantity += quantityToAdd;
            } else {
                state.items.push({
                    ...action.payload,
                    quantity: quantityToAdd,
                });
            }

            const totals = calculateTotals(state.items);
            state.totalAmount = totals.totalAmount;
            state.itemCount = totals.itemCount;
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);

            const totals = calculateTotals(state.items);
            state.totalAmount = totals.totalAmount;
            state.itemCount = totals.itemCount;
        },

        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = Math.max(1, action.payload.quantity); // Prevent 0 or negative
            }

            const totals = calculateTotals(state.items);
            state.totalAmount = totals.totalAmount;
            state.itemCount = totals.itemCount;
        },

        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.itemCount = 0;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
