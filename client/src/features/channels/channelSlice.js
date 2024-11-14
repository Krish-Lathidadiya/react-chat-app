import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createChannel,
  getUserChannels,
  getChannelMessages,
} from "./channelApi";

// Initial state
const initialState = {
  loading: false,
  channels: [],
  error: null,
};

export const createChannelAsync = createAsyncThunk(
  "channel/createChannel",
  async ({ name, members }, { rejectWithValue }) => {
    try {
      const data = await createChannel(name, members);
      console.log("channelSlice create: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserChannelsAsync = createAsyncThunk(
  "channel/getUserChannels",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserChannels();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getChannelMessagesAsync = createAsyncThunk(
  "channel/getChannelMessages",
  async ({channelId}, { rejectWithValue }) => {
    try {
      const data = await getChannelMessages(channelId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle createChannelAsync
      .addCase(createChannelAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createChannelAsync.fulfilled, (state, action) => {
        state.loading = false;
        // state.channels = [...state.channels, action.payload.data.channel];
        state.channels.push(action.payload.data.channel)
      })

      .addCase(createChannelAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getUserChannelsAsync
      .addCase(getUserChannelsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getUserChannelsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload.data.channels;
      })

      .addCase(getUserChannelsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //handle getChannelMessagesAsync
      .addCase(getChannelMessagesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getChannelMessagesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload.data.channel;
      })

      .addCase(getChannelMessagesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default channelSlice.reducer;

// Selectors
export const selectChannels = (state) => state.channel.channels;
export const selectLoader = (state) => state.channel.loading;
export const selectError = (state) => state.channel.error;
