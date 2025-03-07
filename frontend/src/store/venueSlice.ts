import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getVenues, createVenue as apiCreateVenue, updateVenue as apiUpdateVenue, deleteVenue as apiDeleteVenue } from '../api/venue';
import { Venue } from '../types/venue';

// Define state type
interface VenueState {
  venues: Venue[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: VenueState = {
  venues: [],
  status: 'idle',
  error: null,
};

// Async thunk action - Get venue list
export const fetchVenues = createAsyncThunk('venues/fetchVenues', async () => {
  return await getVenues();
});

// Create venue
export const createVenue = createAsyncThunk(
  'venues/createVenue', 
  async (venue: Omit<Venue, 'id' | 'createdAt' | 'lastModified'>) => {
    return await apiCreateVenue(venue);
  }
);

// Update venue
export const updateVenue = createAsyncThunk(
  'venues/updateVenue', 
  async ({ id, venue }: { id: string; venue: Partial<Venue> }) => {
    return await apiUpdateVenue(id, venue);
  }
);

// Delete venue
export const deleteVenue = createAsyncThunk(
  'venues/deleteVenue', 
  async (id: string) => {
    await apiDeleteVenue(id);
    return id;
  }
);

// Create slice
const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get venue list
      .addCase(fetchVenues.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.venues = action.payload;
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch venue list';
      })
      // Create venue
      // Create venue
      .addCase(createVenue.fulfilled, (state, action) => {
        state.venues.push(action.payload);
      })
      // Update venue
      // Update venue
      .addCase(updateVenue.fulfilled, (state, action) => {
        const index = state.venues.findIndex((venue) => venue.id === action.payload.id);
        if (index !== -1) {
          state.venues[index] = action.payload;
        }
      })
      // Delete venue
      // Delete venue
      .addCase(deleteVenue.fulfilled, (state, action) => {
        state.venues = state.venues.filter((venue) => venue.id !== action.payload);
      });
  },
});

export default venueSlice.reducer;