import React,{useState} from "react";
import { HomeContext } from "./homeState";
function HomeContextProvider({  children }) {
  const [option, setOption] = useState(null);

  return <HomeContext.Provider value={{ option,setOption }}>
    {children}
  </HomeContext.Provider>;
}

export default HomeContextProvider;
