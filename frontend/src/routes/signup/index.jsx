import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import { authApiCall } from "../../services/api/authApi";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../../utils/validations";
const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUpApi = async (values) => {
    setLoading(true);
    try {
      const user = await authApiCall("signup", values);
      setLoading(false);
      if (user) {
        return navigate("/signin");
      }
    } catch (error) {
      setLoading(false);
      return message.error(
        error?.response?.data?.msg || "Something went wrong please try again"
      );
    }
  };

  return (
    <Form
      className="signup"
      name="signup_form"
      layout="vertical"
      onFinish={handleSignUpApi}
    >
      <Form.Item
        className="name"
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: "Please input your name!",
          },
          {
            validator: validateName,
          },
        ]}
      >
        <Input />
      </Form.Item>

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
        <span>Already Have An Account? </span>
        <Link to="/signin">SignIn</Link>
      </Form.Item>
      <Form.Item className="button">
        <Button loading={loading} type="primary" htmlType="submit">
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignUp;
