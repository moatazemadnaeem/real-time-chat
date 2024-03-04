import { useState } from "react";
import { Layout } from "antd";
import SideBar from "../../components/sidebar";
import Chat from "../../components/chat";
import HomeContextProvider from "../../store/homeStore/appStore";
function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <HomeContextProvider>
      <Layout className="home-layout">
      <SideBar collapsed={collapsed} />
      <Chat
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
      />
    </Layout>
    </HomeContextProvider>
  );
}

export default Home;
