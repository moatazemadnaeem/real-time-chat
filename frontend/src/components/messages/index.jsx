import React, { useContext, useEffect, useState, useRef } from "react";
import "./Messages.css";
import Message from "../message";
import { AxiosInstance } from "../../axiosConfig/AxiosConfig";
import { message } from "antd";
import { AppContext } from "../../store/appStore/appState";
import { SocketContext } from "../../store/socketStore/socketState";
import { useNavigate } from "react-router-dom";
import { chatApi } from "../../services/api/chatApi";
function Messages({ option, lastMsg }) {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AppContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const bottomEl = useRef(null);
  console.log(messages);
  useEffect(() => {
    socket.on(option.key, (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);
  useEffect(() => {
    const fetchMessagesByChat = async () => {
      try {
        const  data  = await chatApi("get-messages-by-chat", "post",{},option.key);
        setMessages(data.messages);
      } catch (error) {
        if (error?.status === 401) {
          socket.close();
          return navigate("/signin", { replace: true });
        }
        return message.error(
          error?.data?.msg || "Something went wrong please try again"
        );
      }
    };
    fetchMessagesByChat();
  }, [option, lastMsg]);
  useEffect(() => {
    if (messages && messages.length > 0) {
      bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.map((msg, indx, arr) => {
        const currentUserId = user.id;
        const ownChat = currentUserId === msg.senderId;
        if (indx === arr.length - 1) {
          return (
            <div ref={bottomEl} key={msg._id}>
              <Message option={option} text={msg} current={ownChat} />
            </div>
          );
        }
        return (
          <div key={msg._id}>
            <Message option={option} text={msg} current={ownChat} />
          </div>
        );
      })}
    </div>
  );
}

export default Messages;
