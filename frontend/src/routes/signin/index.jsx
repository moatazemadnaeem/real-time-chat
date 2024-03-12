import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";
import { authApiCall } from "../../services/api/authApi";
import { validateEmail, validatePassword } from "../../utils/validations";
const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const handleSignInApi = async (values) => {
    setLoading(true);
    try {
      const user = await authApiCall("signin", "post", values);
      setLoading(false);
      if (user) {
        sessionStorage.setItem("jwt", user.data.token);
        return navigate("/private/home");
      }
    } catch (error) {
      setLoading(false);
      return message.error(
        error?.message || "Something went wrong please try again."
      );
    }
  };
  return (
    <Form
      className="signin"
      name="signin_form"
      layout="vertical"
      onFinish={handleSignInApi}
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
        <Link to="/signup">SignUp</Link>
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
