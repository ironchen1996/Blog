import React, { FC, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { fetchUserProfile } from "../../../Features/User/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RootDispatch } from "../../../Store";
import styles from "./index.module.scss";
import { useRequest } from "ahooks";
import {
  updateProfileRequest,
  updateUserProfile,
} from "../../../Services/user";

const { TextArea } = Input;

const BlogerProfile: FC = () => {
  const [form] = Form.useForm();

  const dispatch: RootDispatch = useDispatch();
  const userProfile = useSelector(
    (state: RootState) => state.user.userProfile[1]
  );

  const { run } = useRequest(
    async (requestData: updateProfileRequest) => {
      const data = await updateUserProfile(1, requestData);
      return data;
    },
    {
      manual: true,
      onSuccess() {
        message.success("修改成功");
      },
      onError() {
        message.error("修改失败");
      },
    }
  );

  const onFinish = (value: any) => {
    const { nickname, avatar, introduction, GitHub, email, discord, LinkedIn } =
      value;

    run({ nickname, avatar, introduction, GitHub, email, discord, LinkedIn });
  };

  useEffect(() => {
    dispatch(fetchUserProfile(1));
  }, []);

  useEffect(() => {
    if (userProfile) {
      form.setFieldsValue({
        nickname: userProfile.nickname,
        avatar: userProfile.avatar,
        introduction: userProfile.introduction,
        GitHub: userProfile.GitHub,
        email: userProfile.email,
        discord: userProfile.discord,
        LinkedIn: userProfile.LinkedIn,
      });
    }
  }, [userProfile, form]);

  return (
    <div className={styles.box}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          labelCol={{ span: 3 }}
          label="昵称"
          name="nickname"
          rules={[{ required: true, message: "请填写昵称" }]}
        >
          <Input size="large" allowClear />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 3 }}
          label="头像"
          name="avatar"
          rules={[{ required: true, message: "请填写头像地址" }]}
        >
          <Input size="large" allowClear />
        </Form.Item>
        <Form.Item
          label="自我介绍"
          name="introduction"
          rules={[
            { required: true, message: "请填写自我介绍" },
            { max: 300, message: "自我介绍不能超过300个字符" },
          ]}
        >
          <TextArea autoSize={{ minRows: 8, maxRows: 8 }} allowClear />
        </Form.Item>
        <Form.Item labelCol={{ span: 3 }} label="GitHub" name="GitHub">
          <Input size="large" allowClear />
        </Form.Item>
        <Form.Item labelCol={{ span: 3 }} label="邮箱" name="email">
          <Input size="large" allowClear />
        </Form.Item>
        <Form.Item labelCol={{ span: 3 }} label="Discord" name="discord">
          <Input size="large" allowClear />
        </Form.Item>
        <Form.Item labelCol={{ span: 3 }} label="领英" name="LinkedIn">
          <Input size="large" allowClear />
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

export default BlogerProfile;
