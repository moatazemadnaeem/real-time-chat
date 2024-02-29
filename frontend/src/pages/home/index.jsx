import { useState } from "react";
import { Layout } from "antd";
import SideBar from "../../components/sidebar";
import Chat from "../../components/chat";
function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [option, setOption] = useState(null);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="home-layout">
      <SideBar option={option} setOption={setOption} collapsed={collapsed} />
      <Chat
        option={option}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
      />
    </Layout>
  );
}

export default Home;
