import React, { FC, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { fetchOptions } from "../../../Features/Options/optionsSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RootDispatch } from "../../../Store";
import styles from "./index.module.scss";
import { useRequest } from "ahooks";
import { updateOptions, updateOptionsRequest } from "../../../Services/options";

const { TextArea } = Input;

const SystemInfo: FC = () => {
  const [form] = Form.useForm();

  const dispatch: RootDispatch = useDispatch();
  const options = useSelector((state: RootState) => state.options.options[1]);

  const { run } = useRequest(
    async (requestData: updateOptionsRequest) => {
      const data = await updateOptions(1, requestData);
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
    const { logoName, logoDiscribe, footerInfo } = value;
    run({ logo: logoName, logoDiscribe, footerInfo });
  };

  useEffect(() => {
    dispatch(fetchOptions(1));
  }, []);

  useEffect(() => {
    if (options) {
      form.setFieldsValue({
        logoName: options.logo,
        logoDiscribe: options.logoDiscribe,
        footerInfo: options.footerInfo,
      });
    }
  }, [options, form]);

  return (
    <div className={styles.optionBox}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="logo名称"
          name="logoName"
          rules={[{ required: true, message: "请输入logo名称" }]}
        >
          <Input size="large" allowClear />
        </Form.Item>
        <Form.Item
          label="logo简介"
          name="logoDiscribe"
          rules={[{ required: true, message: "请输入logo描述" }]}
        >
          <Input size="large" allowClear />
        </Form.Item>
        <Form.Item
          label="底部信息"
          name="footerInfo"
          rules={[
            { required: true, message: "请输入网站底部信息" },
            { max: 200, message: "网站底部信息不能超过200个字符" },
          ]}
        >
          <TextArea
            size="large"
            allowClear
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
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

export default SystemInfo;
