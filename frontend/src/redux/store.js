import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/createUserSlice";
import socketReducer from "./features/socket/createSocketSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    socket: socketReducer,
  },
});
