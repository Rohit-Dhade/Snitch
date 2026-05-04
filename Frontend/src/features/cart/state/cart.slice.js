import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState:{
        items: [],
    },
    reducers: {
        setItems: (state, action) => {
            // Handle both full response objects and direct item arrays
            const cartData = action.payload?.data || action.payload;
            state.items = cartData?.items || (Array.isArray(cartData) ? cartData : []);
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