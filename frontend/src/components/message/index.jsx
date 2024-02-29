import React, { useContext } from "react";
import "./Message.css";
import avatar from "../../assets/avatar.jpeg";
import blueAvatar from "../../assets/blue_avatar.png";
import { AppContext } from "../../store/appStore/appState";

function Message({ text, current, option }) {
  const user = useContext(AppContext);

  const getDate = () => {
    const handleshowtime = (s, m, h, d) => {
      if (h >= 24) {
        return `${d.toFixed(2)} days `;
      }
      if (m >= 60) {
        return `${h.toFixed(2)} hours `;
      }
      if (m > 1 && m < 60) {
        return `${m.toFixed(2)} minutes `;
      }
      if (m < 1) {
        return `${s.toFixed(2)} seconds `;
      }
    };
    if (text && text.createdAt) {
      const currentTime = new Date();
      const messageTime = new Date(text.createdAt);
      const timeDifference = currentTime - messageTime;
      const secondsAgo = timeDifference / 1000;
      const mintuesAgo = timeDifference / (1000 * 60);
      const hoursAgo = timeDifference / (1000 * 60 * 60);
      const daysAgo = timeDifference / (1000 * 60 * 60 * 24);
      return (
        <div className="timeContainer">
          <span>
            {handleshowtime(secondsAgo, mintuesAgo, hoursAgo, daysAgo)}
            ago
          </span>
        </div>
      );
    }
    return (
      <div className="timeContainer">
        <span>No Time</span>
      </div>
    );
  };
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
        {/* name of the user */}
        {getName()}
        {/* msg */}
        <p>{text.msg}</p>
        {/* time the chat is created */}
        {getDate()}
      </div>
      {/* time */}
    </div>
  );
}

export default Message;
