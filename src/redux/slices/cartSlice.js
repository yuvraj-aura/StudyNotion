import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast";

const initialState = {
    totalItem: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        setTotalItems(state, value) {
            state.token = value.payload;
        },

        // add to cart
        addToCart(state, value) {
            state.items.push_back(value.payload);
        },

        // remove from cart
        removeFromCart(state, value) {
            state.items.pop_back(value.payload);
        },

        // reset cart
        resetCart(state, value) {
            state.items = 0;
        }
    }

})

export const {setTotalItems} = cartSlice.actions;
export default cartSlice.reducer;