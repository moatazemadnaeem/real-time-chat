import { createSlice } from "@reduxjs/toolkit";
import {
  failuare_get_user,
  logout_user,
  success_get_user,
} from "../user/createUserSlice";
import io from "socket.io-client";
function getJwtFromSessionStorage() {
  return sessionStorage.getItem("jwt");
}
const setupSocket = () => {
  const newSocket = io("http://localhost:9000", {
    extraHeaders: {
      authentication: getJwtFromSessionStorage(),
    },
  });
  newSocket.io.on("reconnect_attempt", () => {
    newSocket.io.opts.extraHeaders = {
      authentication: getJwtFromSessionStorage(),
    };
  });
  return newSocket;
};
const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(success_get_user, (state) => {
      state.socket = setupSocket();
    });
    builder.addCase(failuare_get_user, (state) => {
      if (state?.socket) {
        state.socket.close();
        state.socket = null;
      }
    });
    builder.addCase(logout_user, (state) => {
      if (state?.socket) {
        state.socket.close();
        state.socket = null;
      }
    });
  },
});
export default socketSlice.reducer;
