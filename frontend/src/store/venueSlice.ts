import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getVenues, createVenue as apiCreateVenue, updateVenue as apiUpdateVenue, deleteVenue as apiDeleteVenue } from '../api/venue';
import { Venue } from '../types/venue';

// 定义状态类型
interface VenueState {
  venues: Venue[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// 初始状态
const initialState: VenueState = {
  venues: [],
  status: 'idle',
  error: null,
};

// 异步thunk action - 获取场地列表
export const fetchVenues = createAsyncThunk('venues/fetchVenues', async () => {
  return await getVenues();
});

// 创建场地
export const createVenue = createAsyncThunk(
  'venues/createVenue', 
  async (venue: Omit<Venue, 'id' | 'createdAt' | 'lastModified'>) => {
    return await apiCreateVenue(venue);
  }
);

// 更新场地
export const updateVenue = createAsyncThunk(
  'venues/updateVenue', 
  async ({ id, venue }: { id: string; venue: Partial<Venue> }) => {
    return await apiUpdateVenue(id, venue);
  }
);

// 删除场地
export const deleteVenue = createAsyncThunk(
  'venues/deleteVenue', 
  async (id: string) => {
    await apiDeleteVenue(id);
    return id;
  }
);

// 创建slice
const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 获取场地列表
      .addCase(fetchVenues.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.venues = action.payload;
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '获取场地列表失败';
      })
      // 创建场地
      .addCase(createVenue.fulfilled, (state, action) => {
        state.venues.push(action.payload);
      })
      // 更新场地
      .addCase(updateVenue.fulfilled, (state, action) => {
        const index = state.venues.findIndex((venue) => venue.id === action.payload.id);
        if (index !== -1) {
          state.venues[index] = action.payload;
        }
      })
      // 删除场地
      .addCase(deleteVenue.fulfilled, (state, action) => {
        state.venues = state.venues.filter((venue) => venue.id !== action.payload);
      });
  },
});

export default venueSlice.reducer;