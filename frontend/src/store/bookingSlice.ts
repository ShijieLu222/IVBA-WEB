import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBookings, createBooking as apiCreateBooking, updateBooking as apiUpdateBooking, deleteBooking as apiDeleteBooking } from '../api/booking';
import { Booking } from '../types/booking';

// Define state type
interface BookingState {
  bookings: Booking[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: BookingState = {
  bookings: [],
  status: 'idle',
  error: null,
};

// Async thunk action - Get booking list
export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async () => {
  return await getBookings();
});

// Create booking
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
    return await apiCreateBooking(booking);
  }
);

// Update booking
export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, booking }: { id: number; booking: Partial<Booking> }) => {
    return await apiUpdateBooking(id, booking);
  }
);

// Delete booking
export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (id: number) => {
    await apiDeleteBooking(id);
    return id;
  }
);

// Create slice
const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get booking list
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch booking list';
      })
      // Create booking
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })
      // Update booking
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex((booking) => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      // Delete booking
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((booking) => booking.id !== action.payload);
      });
  },
});

export default bookingSlice.reducer;
