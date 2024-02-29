import { Modal, Form, Select, Switch, Button, message, Input } from "antd";
import { useState, useContext } from "react";
import { AxiosInstance } from "../../axiosConfig/AxiosConfig";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../store/socketStore/socketState";
function ChatModal({ isModalOpen, setIsModalOpen }) {
  const [isGroup, setIsGroup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
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

  const validateUsersInChat = (_, value) => {
    if (value && value.length > 1 && !isGroup) {
      return Promise.reject(
        new Error(
          "Users in chat should be one only because you did not select group"
        )
      );
    }
    return Promise.resolve();
  };
  const handleSearch = async (value) => {
    try {
      const response = await AxiosInstance.get(
        `/users/search-users?email=${value}`
      );
      setSearchResults(response?.data?.usersFound || []);
    } catch (error) {
      if (error?.response?.status === 401) {
        socket.close();
        return navigate("/signin", { replace: true });
      }
      message.error(
        error?.response?.data?.msg || "Something went wrong please try again"
      );
    }
  };
  const handleBlur = () => {
    setSearchResults([]);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const chatCreated = await AxiosInstance.post("chat/create-chat", values);
      message.success(chatCreated?.data?.msg || "Done.");
    } catch (error) {
      if (error?.response?.status === 401) {
        socket.close();
        return navigate("/signin", { replace: true });
      }
      return message.error(
        error?.response?.data?.msg || "Something went wrong please try again"
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
      <Form form={form} onFinish={onFinish} layout="vertical">
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
              validator: validateUsersInChat,
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
