import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer/combinedReducer';

const store = configureStore({
  reducer: rootReducer,
})

export default store;