import { useState } from "react";
import { Layout, Button, Input, Form, message, Spin } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./Chat.css";
import Messages from "../messages";
import { useNavigate } from "react-router-dom";
import { chatApi } from "../../services/api/chatApi";
import { useSelector, useDispatch } from "react-redux";
import { logout_user } from "../../redux/features/user/createUserSlice";
const { Header, Content } = Layout;

function Chat({ collapsed, toggleCollapsed }) {
  const [loading, setLoading] = useState(false);
  const [lastMsg, setLastMsg] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { selectionSider } = useSelector((state) => state.chat);
  const handleSendingMsg = async (values) => {
    try {
      setLoading(true);
      const data = await chatApi(
        "send-msg",
        "post",
        values,
        selectionSider.key
      );
      socket.emit("message", {
        msg: values.msg,
        chatId: selectionSider.key,
        senderId: user.id,
        createdAt: new Date(),
        _id: data.text._id,
      });
      setLastMsg(data?.text?.msg || null);
    } catch (error) {
      if (error?.status === 401) {
        socket.close();
        return navigate("/", { replace: true });
      }
      return message.error(
        error?.data?.msg || "Something went wrong please try again."
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
                dispatch(logout_user());
                socket.close();
                navigate("/", { replace: true });
              }}
            />
          </div>
        </div>
      </Header>
      {selectionSider ? (
        <Content className="content">
          {loading ? (
            <div className="content-spin-container">
              <Spin size="large" className="content-spin" />
            </div>
          ) : (
            <>
              <Messages lastMsg={lastMsg} />
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
