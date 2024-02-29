import { useState, useContext } from "react";
import { Layout } from "antd";
import SideBar from "../../components/sidebar";
import Chat from "../../components/chat";
import { AppContext } from "../../store/appStore/appState";
function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [option, setOption] = useState(null);
  const { socket } = useContext(AppContext);
  console.log("context", socket);
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
