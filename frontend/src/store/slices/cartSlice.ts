import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    note?: string;
    maxAvailable: number;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                if (existingItem.quantity < action.payload.maxAvailable) {
                    existingItem.quantity += 1;
                }
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                const newQty = Math.max(1, Math.min(action.payload.quantity, item.maxAvailable));
                item.quantity = newQty;
            }
        },
        updateNote: (state, action: PayloadAction<{ id: string; note: string }>) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.note = action.payload.note;
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, updateNote, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
