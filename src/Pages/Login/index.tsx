import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Space,
  Typography,
  Form,
  Input,
  Checkbox,
  Button,
  Card,
  message,
} from "antd";
import { IdcardTwoTone, LockOutlined, UserOutlined } from "@ant-design/icons";
import { REMEMBER_KEY } from "../../Constants/UserKey";
import { setToken } from "../../Utils/user-token";
import {
  deleteUserFormStorage,
  getUserInfoFormStorage,
  rememberUser,
} from "../../Utils/login-remeber";
import {
  ADMIN_PATHNAME,
  ARTICLESMANAGEMENT_PATHNAME,
} from "../../Constants/PathName";
import styles from "./index.module.scss";
import { useRequest } from "ahooks";
import { loginService } from "../../Services/user";

const { Title } = Typography;

const Login: FC = () => {
  const nav = useNavigate();

  const [form] = Form.useForm();

  useEffect(() => {
    const { username, password, remember } = getUserInfoFormStorage();
    form.setFieldsValue({ username, password, remember });
  }, []);

  const { run } = useRequest(
    async (username: string, password: string) => {
      const data = await loginService(username, password);
      return data;
    },
    {
      manual: true,
      onSuccess(result) {
        const response = result;
        setToken(response.data.access_token);
        message.success("登录成功");
        nav(`${ADMIN_PATHNAME}${ARTICLESMANAGEMENT_PATHNAME}`);
      },
      onError() {
        message.error("账号或密码错误");
      },
    }
  );

  const onFinish = async (values: any) => {
    const { username, password, remember } = values || {};
    localStorage.setItem("username", username);

    run(username, password);

    if (remember) {
      rememberUser(username, password);
      localStorage.setItem(REMEMBER_KEY, "true");
    } else {
      deleteUserFormStorage();
      localStorage.setItem(REMEMBER_KEY, "false");
    }
  };

  return (
    <Card className={styles.centeredElement}>
      <div className={styles.titleCentered}>
        <Space>
          <Title level={2}>
            <IdcardTwoTone style={{ fontSize: "64px" }} />
          </Title>
          <Title level={2}>博客管理后台</Title>
        </Space>
      </div>
      <div>
        <Form
          name="normal_Login"
          className="Login-form"
          initialValues={{ remmenber: true }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>自动登录</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default Login;
