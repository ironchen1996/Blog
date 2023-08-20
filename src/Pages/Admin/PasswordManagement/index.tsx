import React, { FC } from "react";
import { Button, Form, Input, message } from "antd";
import styles from "./index.module.scss";
import { useRequest } from "ahooks";
import { updatePassword, updatePasswordRequest } from "../../../Services/user";
import { useNavigate } from "react-router-dom";
import { ADMIN_PATHNAME, LOGIN_PATHNAME } from "../../../Constants/PathName";
import { removeToken } from "../../../Utils/user-token";

const PasswordManagement: FC = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();

  const { run } = useRequest(
    async (requestData: updatePasswordRequest) => {
      const data = updatePassword(requestData);
      return data;
    },
    {
      manual: true,
      onSuccess() {
        message.success("密码修改成功");
        removeToken();
        nav(`${ADMIN_PATHNAME}${LOGIN_PATHNAME}`);
      },
      onError() {
        message.error("密码修改失败");
      },
    }
  );

  const onFinish = (value: any) => {
    const username = localStorage.getItem("username");
    console.log(username);
    const { presentPassword, confirmPassword } = value;

    if (username) {
      run({
        username,
        oldPassword: presentPassword,
        newPassword: confirmPassword,
      });
    }
  };

  const passwordValidator = (_: any, value: string) => {
    const pattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

    if (pattern.test(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject(
        "密码长度必须在8到16位之间，且包含英文、数字和特殊符号"
      );
    }
  };

  return (
    <div className={styles.passwordBox}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          labelCol={{ span: 5 }}
          label="当前密码"
          name="presentPassword"
          rules={[{ required: true }]}
        >
          <Input size="large" allowClear />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          label="新密码"
          name="newPassword"
          rules={[{ required: true, validator: passwordValidator }]}
        >
          <Input.Password size="large" allowClear />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          label="确认新密码"
          name="confirmPassword"
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("两次输入的新密码不一致");
              },
            }),
          ]}
        >
          <Input.Password size="large" allowClear />
        </Form.Item>
        <Form.Item className={styles.buttonBox}>
          <Button size="large" htmlType="reset">
            重置
          </Button>
          <Button
            className={styles.submitButton}
            size="large"
            type="primary"
            htmlType="submit"
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PasswordManagement;
