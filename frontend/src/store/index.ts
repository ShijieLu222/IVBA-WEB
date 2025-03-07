import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import venueReducer from './venueSlice';
import bookingReducer from './bookingSlice';

export const store = configureStore({
  reducer: {
    venues: venueReducer,
    bookings: bookingReducer,
  },
});

// 为dispatch和selector定义类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 定义类型化的hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;