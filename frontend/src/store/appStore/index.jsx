import React from "react";
import { AppContext } from "./appState";
function AppContextProvider({ user, children }) {
  return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
