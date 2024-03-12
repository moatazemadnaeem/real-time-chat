import React, { useEffect, useState, useRef } from "react";
import "./Messages.css";
import Message from "../message";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { chatApi } from "../../services/api/chatApi";
import { useSelector } from "react-redux";
function Messages({ lastMsg }) {
  const [messages, setMessages] = useState([]);
  const { user } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { selectionSider } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const bottomEl = useRef(null);
  useEffect(() => {
    socket.on(selectionSider.key, (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);
  useEffect(() => {
    const fetchMessagesByChat = async () => {
      try {
        const data = await chatApi(
          "get-messages-by-chat",
          "post",
          {},
          selectionSider.key
        );
        setMessages(data.messages);
      } catch (error) {
        if (error?.status === 401) {
          socket.close();
          return navigate("/", { replace: true });
        }
        return message.error(
          error?.data?.msg || "Something went wrong please try again."
        );
      }
    };
    fetchMessagesByChat();
  }, [selectionSider, lastMsg]);
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
              <Message text={msg} current={ownChat} />
            </div>
          );
        }
        return (
          <div key={msg._id}>
            <Message text={msg} current={ownChat} />
          </div>
        );
      })}
    </div>
  );
}

export default Messages;
