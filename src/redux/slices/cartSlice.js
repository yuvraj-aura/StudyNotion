import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const uniqueCourses = (courses) => [...new Map((Array.isArray(courses) ? courses : [])
    .filter((course) => course?._id)
    .map((course) => [String(course._id).toLowerCase(), course])).values()];

const initialState = {
    // The database hydrates the cart for the current authenticated user.
    cart: [],
    total: 0,
    totalItems: 0,
    paymentLoading: false,
    cartUpdating: false,
    cartLoading: false,
    cartReady: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        setCart: (state, action) => {
            state.cart = uniqueCourses(action.payload);
            state.totalItems = state.cart.length;
            state.total = state.cart.reduce((acc, curr) => acc + (curr.price || 0), 0);
            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("total", JSON.stringify(state.total));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
        },

        addToCart: (state, action) => {
            const course = action.payload;
            const index = state.cart.findIndex((item) => item._id === course._id);

            if (index >= 0) {
                // if the course is already in the cart, do not modify the qty
                toast.error("Course already in cart")
                return;
            }
            //   if the course is not in the cart, add it to cart
            state.cart.push(course);
            //   update the total qty and price
            state.totalItems++;
            state.total += course.price || 0;

            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("total", JSON.stringify(state.total));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
        },

        removeFromCart: (state, action) => {
            const courseId = action.payload;
            const index = state.cart.findIndex((item) => item._id === courseId);

            if (index >= 0) {
                //   update the total qty and price
                state.totalItems--;
                state.total -= state.cart[index].price || 0;
                
                state.cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(state.cart));
                localStorage.setItem("total", JSON.stringify(state.total));
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
            }
        },
        resetCart: (state) => {
            state.cartReady = false;
            state.cartLoading = false;
            state.cartUpdating = false;
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;
            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("totalItems");
        },
        setTotalItems: (state, action) => {
            state.totalItems = action.payload;
        },
        setCartLoading: (state, action) => {
            state.cartLoading = action.payload;
            if (action.payload) state.cartReady = false;
        },
        setCartReady: (state, action) => { state.cartReady = action.payload; },
        setCartUpdating: (state, action) => {
            state.cartUpdating = action.payload;
        },
        setPaymentLoading: (state, action) => {
            state.paymentLoading = action.payload;
        },
    },
});

export const { setCart, addToCart, removeFromCart, resetCart, setTotalItems, setPaymentLoading, setCartUpdating, setCartLoading, setCartReady } =
    cartSlice.actions;

export default cartSlice.reducer;