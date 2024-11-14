import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signUp,
  signIn,
  getUserInfo,
  updateUserProfile,
  signOut,
} from "./authApi";
// Correcting the typo
const initialState = {
  loading: false,
  user: null,
};

export const signUpAsync = createAsyncThunk(
  "auth/signUp",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await signUp(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInAsync = createAsyncThunk(
  "auth/signIn",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await signIn(formData);
      console.log("authSlice signIn", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserInfoAsync = createAsyncThunk(
  "auth/getUserInfo",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await getUserInfo(formData);
      // console.log("authSlice user-info", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfileAsync = createAsyncThunk(
  "auth/updateUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await updateUserProfile(formData);
      // console.log("authSlice update-profile", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOutAsync = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const data = await signOut();
      console.log("authSlice signout", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState, // Correcting the typo
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(signUpAsync.rejected, (state) => {
        state.loading = false;
      })

      // handle signInAsync
      .addCase(signInAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(signInAsync.rejected, (state) => {
        state.loading = false;
      })

      // handle getUserInfoAsync
      .addCase(getUserInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(getUserInfoAsync.rejected, (state) => {
        state.loading = false;
      })

      // handle updateUserProfileAsync
      .addCase(updateUserProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(updateUserProfileAsync.rejected, (state) => {
        state.loading = false;
      })

      // handle signOutAsync
      .addCase(signOutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(signOutAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectLoader = (state) => state.auth.loading;
