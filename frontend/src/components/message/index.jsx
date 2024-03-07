import React from "react";
import "./Message.css";
import avatar from "../../assets/avatar.jpeg";
import blueAvatar from "../../assets/blue_avatar.png";
import { getDate } from "../../utils/formatting";
import { useSelector } from "react-redux";
function Message({ text, current }) {
  const { user } = useSelector((state) => state.user);
  const { selectionSider } = useSelector((state) => state.chat);
  const getName = () => {
    const id = user.id;
    const senderId = text.senderId;
    if (senderId === id) {
      return (
        <div className="name-top">
          <span>Me</span>
        </div>
      );
    }
    if (senderId === selectionSider.userId) {
      return (
        <div className="name-top">
          <span>{selectionSider.chatCreatorName}</span>
        </div>
      );
    }
    if (selectionSider && selectionSider.users) {
      for (let i = 0; i < selectionSider.users.length; i++) {
        if (senderId === selectionSider.users[i]._id) {
          return (
            <div className="name-top">
              <span>{selectionSider.users[i].name}</span>
            </div>
          );
        }
      }
    }

    return (
      <div className="name-top">
        <span>No Name</span>
      </div>
    );
  };
  return (
    <div className={`message ${current && "right"}`}>
      <div className={`logo ${current && "logo-right"}`}>
        {current ? (
          <img src={blueAvatar} alt="No Img" />
        ) : (
          <img src={avatar} alt="No Img" />
        )}
      </div>
      <div className={`message-content ${current && "message-content-right"}`}>
        {getName()}
        <p>{text.msg}</p>
        {text ? (
          <div className="timeContainer">
            <span>
              {getDate(text)}
              ago
            </span>
          </div>
        ) : (
          <div className="timeContainer">
            <span>No Time</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
