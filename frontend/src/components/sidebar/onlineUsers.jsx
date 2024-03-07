import { Modal } from "antd";
import React from "react";
import { useSelector } from "react-redux";
function OnlineUsers({
  chatSelected,
  modalGroupOnlineUsers,
  setModalGroupOnlineUsers,
  onlineUsers,
}) {
  const { user } = useSelector((state) => state.user);
  let Users;
  if (chatSelected) {
    Users = [
      { _id: chatSelected?.userId, name: chatSelected?.chatCreatorName },
      ...chatSelected?.users,
    ];
  }

  const handleOnlineStatus = (indx = 0, array) => {
    if (onlineUsers.includes(array[indx]._id)) {
      return "circle-online";
    }
    return "circle-offline";
  };
  const handleUsersView = () => {
    if (Users) {
      return Users.filter((userRecord) => userRecord._id !== user.id).map(
        (item, indx, array) => {
          return (
            <div key={item._id} className={`user-modal`}>
              <div
                className={`modal-circle ${handleOnlineStatus(indx, array)}`}
              ></div>
              <span> {item.name}</span>
            </div>
          );
        }
      );
    }
  };
  return (
    <Modal
      title={`Online/Offline Users In ${chatSelected?.chatName}`}
      open={modalGroupOnlineUsers}
      onCancel={() => setModalGroupOnlineUsers(false)}
      footer={null}
    >
      <div className="modal-users-status">{handleUsersView()}</div>
    </Modal>
  );
}

export default OnlineUsers;
