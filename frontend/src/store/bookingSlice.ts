import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 定义预订类型
export interface Booking {
  id: number;
  venue_id: number;
  user_name: string;
  contact: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// 定义状态类型
interface BookingState {
  bookings: Booking[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// 初始状态
const initialState: BookingState = {
  bookings: [],
  status: 'idle',
  error: null,
};

// 异步thunk action - 获取预订列表
export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async () => {
  const response = await axios.get('/api/bookings');
  return response.data;
});

// 创建预订
export const createBooking = createAsyncThunk('bookings/createBooking', 
  async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await axios.post('/api/bookings', booking);
    return response.data;
});

// 更新预订
export const updateBooking = createAsyncThunk('bookings/updateBooking', 
  async ({ id, booking }: { id: number; booking: Partial<Booking> }) => {
    const response = await axios.put(`/api/bookings/${id}`, booking);
    return response.data;
});

// 删除预订
export const deleteBooking = createAsyncThunk('bookings/deleteBooking', async (id: number) => {
  await axios.delete(`/api/bookings/${id}`);
  return id;
});

// 创建slice
const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 获取预订列表
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '获取预订列表失败';
      })
      // 创建预订
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })
      // 更新预订
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex((booking) => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      // 删除预订
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((booking) => booking.id !== action.payload);
      });
  },
});

export default bookingSlice.reducer;