import { Modal, Form, Select, Switch, Button, message, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApiCall } from "../../services/api/authApi";
import { chatApi } from "../../services/api/chatApi";
import { useSelector } from "react-redux";
import { validateUsersInChat } from "../../utils/validations";
function ChatModal({ isModalOpen, setIsModalOpen }) {
  const [isGroup, setIsGroup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const { socket } = useSelector((state) => state.socket);
  const [form] = Form.useForm();
  const handleCancel = () => {
    setIsModalOpen(false);
    setSearchResults([]);
    setIsGroup(false);
    form.resetFields();
  };
  const handleGroupChange = () => {
    setIsGroup(!isGroup);
    form.validateFields();
  };

  const handleSearch = async (value) => {
    try {
      const response = await authApiCall(`search-users?email=${value}`, "get");
      setSearchResults(response?.data?.usersFound || []);
    } catch (error) {
      if (error?.response?.status === 401) {
        socket.close();
        return navigate("/", { replace: true });
      }
      return message.error(
        error?.data?.msg || "Something went wrong please try again."
      );
    }
  };
  const handleBlur = () => {
    setSearchResults([]);
  };

  const handleCreateChat = async (values) => {
    try {
      setLoading(true);
      const data = await chatApi("create-chat", "post", values);
      message.success(data?.msg || "Done.");
      socket.emit("chatCreated", data?.chat);
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
      handleCancel();
    }
  };
  return (
    <Modal
      className="add-user-modal"
      title="Add User For Chat"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null} // Set footer to null to remove buttons
    >
      <Form form={form} onFinish={handleCreateChat} layout="vertical">
        {/* usersInChat */}
        <Form.Item
          name="usersInChat"
          label="Users in Chat"
          rules={[
            {
              required: true,
              message: "Please Input Atleast One User",
            },
            {
              validator: (_, value) => validateUsersInChat(_, value, isGroup),
            },
          ]}
        >
          <Select
            mode="multiple"
            onSearch={handleSearch}
            placeholder="Select users"
            filterOption={false}
            options={searchResults.map((user) => {
              return {
                label: user.name,
                value: user._id,
              };
            })}
            onBlur={handleBlur}
          ></Select>
        </Form.Item>
        {/* isGroup */}
        <Form.Item
          name="isGroup"
          label="Is Group?"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch onChange={handleGroupChange} />
        </Form.Item>
        {/* isGroup - chatName */}
        {isGroup && (
          <Form.Item
            name="chatName"
            label="Chat Name"
            rules={[
              {
                required: true,
                message: "Please Input Chat Name",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
        )}
        {/* submit button */}
        <Form.Item className="button">
          <Button loading={loading} type="primary" htmlType="submit">
            Add User
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ChatModal;
