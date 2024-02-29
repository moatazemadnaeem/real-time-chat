import React, { useContext } from "react";
import "./Message.css";
import avatar from "../../assets/avatar.jpeg";
import blueAvatar from "../../assets/blue_avatar.png";
import { AppContext } from "../../store/appStore/appState";
import { getDate } from "../../utils/formatting";
function Message({ text, current, option }) {
  const user = useContext(AppContext);
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
    if (senderId === option.userId) {
      return (
        <div className="name-top">
          <span>{option.chatCreatorName}</span>
        </div>
      );
    }
    if (option && option.users) {
      for (let i = 0; i < option.users.length; i++) {
        if (senderId === option.users[i]._id) {
          return (
            <div className="name-top">
              <span>{option.users[i].name}</span>
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
