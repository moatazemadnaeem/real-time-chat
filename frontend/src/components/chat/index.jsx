import { useContext, useState } from "react";
import { Layout, Button, Input, Form, message, Spin } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./Chat.css";
import Messages from "../messages";
import { AppContext } from "../../store/appStore/appState";
import { SocketContext } from "../../store/socketStore/socketState";
import { AxiosInstance } from "../../axiosConfig/AxiosConfig";
import { useNavigate } from "react-router-dom";
import { chatApi } from "../../services/api/chatApi";
const { Header, Content } = Layout;

function Chat({ collapsed, toggleCollapsed, option }) {
  const [loading, setLoading] = useState(false);
  const [lastMsg, setLastMsg] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const { socket } = useContext(SocketContext);
  const handleSendingMsg = async (values) => {
    try {
      setLoading(true);
      const  data  = await chatApi("send-msg","post",values,option.key);
      socket.emit("message", {
        msg: values.msg,
        chatId: option.key,
        senderId: user.id,
        createdAt: new Date(),
      });
      setLastMsg(data?.text?.msg || null);
    } catch (error) {
      if (error?.status === 401) {
        socket.close();
        return navigate("/signin", { replace: true });
      }
      return message.error(
        error?.data?.msg || "Something went wrong please try again"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout className="chat">
      <Header className="header">
        {collapsed ? (
          <MenuUnfoldOutlined className="trigger" onClick={toggleCollapsed} />
        ) : (
          <MenuFoldOutlined className="trigger" onClick={toggleCollapsed} />
        )}
        <div className="header-content">
          <span className="header-content-name">{user.name}</span>
          <div className="logout-container">
            <LogoutOutlined
              className="logout"
              onClick={() => {
                sessionStorage.setItem("jwt", null);
                socket.close();
                navigate("/signin", { replace: true });
              }}
            />
          </div>
        </div>
      </Header>
      {option ? (
        <Content className="content">
          {/* Content area */}
          {loading ? (
            <div className="content-spin-container">
              <Spin size="large" className="content-spin" />
            </div>
          ) : (
            <>
              <Messages option={option} lastMsg={lastMsg} />
              <Form className="send-container" onFinish={handleSendingMsg}>
                <Form.Item
                  name="msg"
                  className="input"
                  rules={[
                    {
                      required: true,
                      message: "please input a message",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button loading={loading} htmlType="submit">
                    Send
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </Content>
      ) : (
        <div className="select-user">
          <h1>Select user to chat with 🚀</h1>
        </div>
      )}
    </Layout>
  );
}

export default Chat;
