import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    signInSuccess: (state, action) => {
      (state.currentUser = action.payload), (state.loading = false);
      state.error = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfilePhoto: (state, action) => {
      if (state.currentUser) {
        state.currentUser.profilePhoto = action.payload; // Update the profile photo URL
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailure, updateProfilePhoto } =
  userSlice.actions;

export default userSlice.reducer;
