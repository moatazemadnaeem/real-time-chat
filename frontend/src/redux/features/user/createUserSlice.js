import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: null,
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    req_user: (state) => {
      state.loading = true;
    },
    success_get_user: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    failuare_get_user: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
    },
    logout_user: (state) => {
      state.user = null;
      sessionStorage.setItem("jwt", null);
    },
  },
});
export default userSlice.reducer;
export const { req_user, success_get_user, failuare_get_user, logout_user } =
  userSlice.actions;
