import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";
import { AxiosInstance } from "../../axiosConfig/AxiosConfig";

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const user = await AxiosInstance.post("users/signin", values);
      sessionStorage.setItem("jwt", user.data.token);
      setLoading(false);
      if (user) {
        return navigate("/private/home");
      }
    } catch (error) {
      setLoading(false);
      return message.error(
        error?.response?.data?.msg || "Something went wrong please try again"
      );
    }
  };

  const validateEmail = (_, value) => {
    // Email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      return Promise.reject(new Error("Invalid email address"));
    }
    return Promise.resolve();
  };

  const validatePassword = (_, value) => {
    if (!value || value.length < 6 || value.length > 255) {
      return Promise.reject(
        new Error("Password must be between 6 and 255 characters")
      );
    }
    return Promise.resolve();
  };

  return (
    <Form
      className="signin"
      name="signin_form"
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        className="email"
        name="email"
        label="Email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
          {
            validator: validateEmail,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        className="password"
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
          {
            validator: validatePassword,
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item className="link">
        <span> Do Not Have an account? </span>
        <Link to="/">SignUp</Link>
      </Form.Item>
      <Form.Item className="button">
        <Button loading={loading} type="primary" htmlType="submit">
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignIn;
