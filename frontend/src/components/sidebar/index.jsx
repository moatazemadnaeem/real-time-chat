import { Layout, Input, Menu, message, Spin } from "antd";
import "./Sider.css";
import { useEffect, useState, useContext } from "react";
import { TeamOutlined, UserOutlined, UserAddOutlined } from "@ant-design/icons";
import ChatModal from "./chatModal";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../store/socketStore/socketState";
import { AppContext } from "../../store/appStore/appState";
import OnlineUsers from "./onlineUsers";
import { chatApi } from "../../services/api/chatApi";
import { HomeContext } from "../../store/homeStore/appStore/homeState";
const { Sider } = Layout;
const { Search } = Input;
function SideBar({ collapsed }) {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [modalGroupOnlineUsers, setModalGroupOnlineUsers] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AppContext);
  const {option,setOption}=useContext(HomeContext)
  const showModal = () => {
    setIsModalOpen(true);
  };
  const fetchChatsByUser = async () => {
    try {
      setLoading(true);
      const  data  = await chatApi("get-chats-by-user","get");
      setChats(data.chats);
    } catch (error) {
      if (error?.status === 401) {
        socket.close();
        return navigate("/signin", { replace: true });
      }
      return message.error(
        error?.data?.msg || "Something went wrong please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    !isModalOpen && fetchChatsByUser();
  }, [isModalOpen]);
  useEffect(() => {
    if (socket) {
      socket.on("onlineUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [socket]);
  const handleMenuSelect = (item) => {
    const chat = chats.filter((chat) => chat._id === item.key)[0];
    setOption({
      key: item.key,
      userId: chat.userId,
      users: chat.usersInChat,
      chatCreatorName: chat.chatCreatorName,
      chatName: chat.chatName,
    });
  };
  const filteredChats = chats.filter((chat) =>
    chat.chatName.toLowerCase().includes(searchText.toLowerCase())
  );
  console.log(chats, onlineUsers);
  const handleOnlineStatus = (indx = 0) => {
    if (
      (user.id === chats[indx]?.userId &&
        onlineUsers.includes(chats[indx]?.usersInChat[0]._id)) ||
      (user.id !== chats[indx]?.userId &&
        onlineUsers.includes(chats[indx]?.userId))
    ) {
      return "circle-online";
    }
    return "circle-offline";
  };
  return (
    <Sider className="sider" collapsed={collapsed}>
      {loading ? (
        <div className="sider-spin-container">
          <Spin className="sider-spin" />
        </div>
      ) : (
        <>
          {chats.length === 0 ? (
            <div className="sider-create-container">
              <span>Create A Chat 💬</span>
              <UserAddOutlined onClick={showModal} className="header-logo" />
            </div>
          ) : (
            <>
              <div className="search">
                <Search
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search..."
                />
              </div>
              <Menu
                onSelect={handleMenuSelect}
                theme="dark"
                className="menu"
                items={filteredChats.map((chat, indx) => {
                  return {
                    key: chat._id,
                    label: chat.chatName,
                    icon: chat.isGroup ? (
                      <TeamOutlined
                        onClick={() =>
                          setModalGroupOnlineUsers(!modalGroupOnlineUsers)
                        }
                        className="user-icon-group"
                      />
                    ) : (
                      <div className="user-icon-status">
                        <div
                          className={`circle ${handleOnlineStatus(indx)} `}
                        ></div>
                        <UserOutlined />
                      </div>
                    ),
                  };
                })}
              ></Menu>
              <div className="data-sider-create-container">
                <span>Create A Chat 💬</span>
                <UserAddOutlined onClick={showModal} className="header-logo" />
              </div>
            </>
          )}
          <ChatModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
          <OnlineUsers
            modalGroupOnlineUsers={modalGroupOnlineUsers}
            setModalGroupOnlineUsers={setModalGroupOnlineUsers}
            chatSelected={option}
            onlineUsers={onlineUsers}
          />
        </>
      )}
    </Sider>
  );
}

export default SideBar;
