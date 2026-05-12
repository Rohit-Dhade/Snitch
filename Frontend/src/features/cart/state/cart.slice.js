import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState:{
        items: [],
        totalPrice: 0,
        currency: "INR",
    },
    reducers: {
        setItems: (state, action) => {
            // The aggregate API returns data as an array: data[0] = { totalPrice, currency, items }
            const payload = action.payload;

            if (Array.isArray(payload) && payload.length > 0) {
                // Aggregate response: data = [{ _id, totalPrice, currency, items }]
                const cartData = payload[0];
                state.items = cartData.items || [];
                state.totalPrice = cartData.totalPrice || 0;
                state.currency = cartData.currency || "INR";
            } else if (payload?.items) {
                // Fallback for non-aggregate responses (remove/update still return populated cart)
                state.items = payload.items || [];
                state.totalPrice = 0;
                state.currency = "INR";
            } else {
                state.items = [];
                state.totalPrice = 0;
                state.currency = "INR";
            }
        },
        addToCart: (state, action) => {
            state.items.push(action.payload);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
        },
        updateQuantity: (state, action) => {
            const {itemId, quantity} = action.payload;
            const item = state.items.find(item => item._id === itemId);
            if(item){
                item.quantity = quantity;
            }
        }
    }
})

export const {setItems, addToCart, removeFromCart, updateQuantity} = cartSlice.actions;
export default cartSlice.reducer;