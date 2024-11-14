import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchContacts,getContactsForDMList,getAllContacts } from "./contactsApi";

// Initial state
const initialState = {
  loading: false,
  contacts: [],
  error: null,
};

export const searchContactsAsync = createAsyncThunk(
  "contacts/searchContacts",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const data = await searchContacts(searchTerm);
      // console.log("contactsSlice searchTerm: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getContactsForDMListAsync = createAsyncThunk(
  "contacts/getContactsForDMList",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getContactsForDMList();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const getAllContactsAsync = createAsyncThunk(
  "contacts/getAllContacts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllContacts();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// SlicgetContactsForDMListe
const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle searchContactsAsync
      .addCase(searchContactsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(searchContactsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data.contacts;
      })

      .addCase(searchContactsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //handle getContactsForDMListAsync
      .addCase(getContactsForDMListAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getContactsForDMListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data.contacts;
      })

      .addCase(getContactsForDMListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //handle getAllContactsAsync
      .addCase(getAllContactsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllContactsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data.contacts;
      })

      .addCase(getAllContactsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default contactsSlice.reducer;

// Selectors
export const selectContacts = (state) => state.contacts.contacts;
export const selectLoader = (state) => state.contacts.loading;
export const selectError = (state) => state.contacts.error;
