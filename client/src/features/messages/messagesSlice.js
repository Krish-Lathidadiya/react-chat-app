import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMessages, uploadFile } from "./messagesApi";

// Initial state
const initialState = {
  loading: false,
  messages: [],
  error: null,
};

export const getMessagesAsync = createAsyncThunk(
  "messages/getMessages",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await getMessages(id);
      console.log("messagesSlice getMessages: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadFileAsync = createAsyncThunk(
  "messages/uploadFile",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await uploadFile(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getMessagesAsync
      .addCase(getMessagesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMessagesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data.messages;
      })

      .addCase(getMessagesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //handle uploadFileAsync
      .addCase(uploadFileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(uploadFileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data.fileUrl;
      })

      .addCase(uploadFileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default messagesSlice.reducer;

// Selectors
export const selectMessages = (state) => state.messages.messages;
export const selectLoader = (state) => state.messages.loading;
export const selectError = (state) => state.messages.error;
