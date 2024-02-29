import React, { useEffect, useState } from "react";
import { SocketContext } from "./socketState";
import io from "socket.io-client";

function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    function getJwtFromSessionStorage() {
      return sessionStorage.getItem("jwt");
    }
    const newSocket = io("http://localhost:9000", {
      extraHeaders: {
        authentication: getJwtFromSessionStorage(),
      },
    });
    setSocket(newSocket);

    newSocket.io.on("reconnect_attempt", () => {
      console.log("attempt");
      newSocket.io.opts.extraHeaders = {
        authentication: getJwtFromSessionStorage(),
      };
    });
  }, []);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContextProvider;
