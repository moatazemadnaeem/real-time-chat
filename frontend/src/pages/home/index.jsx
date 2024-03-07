import { useState } from "react";
import { Layout } from "antd";
import SideBar from "../../components/sidebar";
import Chat from "../../components/chat";
function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="home-layout">
      <SideBar collapsed={collapsed} />
      <Chat collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
    </Layout>
  );
}

export default Home;
