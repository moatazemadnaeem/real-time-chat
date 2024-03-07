import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/createUserSlice";
import socketReducer from "./features/socket/createSocketSlice";
import chatReducer from "./features/chat/createChatSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    socket: socketReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
