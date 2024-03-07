import { createSlice } from "@reduxjs/toolkit";
import { logout_user } from "../user/createUserSlice";
const initialState = {
  selectionSider: null,
};
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    set_user: (state, action) => {
      state.selectionSider = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout_user, (state) => {
      state.selectionSider = null;
    });
  },
});
export default chatSlice.reducer;
export const { set_user } = chatSlice.actions;
