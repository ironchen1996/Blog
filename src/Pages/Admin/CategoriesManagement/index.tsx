import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { fetchCategories } from "../../../Features/Categories/categoriesSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RootDispatch } from "../../../Store";
import styles from "./index.module.scss";
import { processCategoriesManagementData } from "../../../Utils/processCategoriesManagementData";
import { useRequest } from "ahooks";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../../Services/categories";
import { Link } from "react-router-dom";
import { CATEGORY_PATHNAME } from "../../../Constants/PathName";

interface DataType {
  key: React.Key;
  id: number;
  name: string;
}

const CategoriesManagement: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [selectedKey, setSelectedKey] = useState(1);
  const [form] = Form.useForm();

  const showModal = (value: boolean, key?: number) => {
    setIsModalOpen(true);
    setIsCreate(value);
    setSelectedKey(key || 1);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const confirm = async (id: number) => {
    try {
      await deleteCategory(id);
      message.success("删除成功");
      dispatch(fetchCategories());
    } catch (error) {
      message.error("分类不存在");
    }
  };

  const cancel = () => {
    message.error("已取消");
  };

  const columns: ColumnsType<DataType> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "分类", dataIndex: "name", key: "name" },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <Link to={`${CATEGORY_PATHNAME}/${record.id}`} target="_blank">
            查看
          </Link>
          <a
            onClick={() => {
              showModal(false, record.id);
            }}
          >
            修改
          </a>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => {
              confirm(record.id);
            }}
            onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const { run } = useRequest(
    async (name: any) => {
      let data;
      if (isCreate === true) {
        data = await createCategory(name);
        return data;
      } else if (isCreate === false) {
        data = await updateCategory(selectedKey, name);
        return data;
      }
    },
    {
      manual: true,
      onSuccess() {
        message.success(isCreate ? "创建成功" : "修改成功");
        dispatch(fetchCategories());
      },
      onError(error) {
        const errorMessage =
          error.message === "Request failed with status code 409" &&
          "分类已存在";
        message.error(errorMessage || (isCreate ? "创建失败" : "修改失败"));
      },
    }
  );

  const onFinish = (value: any) => {
    setIsModalOpen(false);
    const { category } = value;
    run({ name: category });
  };

  const dispatch: RootDispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const status = useSelector((state: RootState) => state.categories.status);

  const processData: DataType[] = processCategoriesManagementData(categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    if (categories && isCreate === false) {
      const getCategory = processData.find(
        (category) => category.id === selectedKey
      );
      form.setFieldsValue({ category: getCategory?.name });
    } else {
      form.setFieldsValue({ category: "" });
    }
  }, [isModalOpen, form]);

  return (
    <div className={styles.box}>
      <div className={styles.createButton}>
        <Button
          type="primary"
          onClick={() => {
            showModal(true);
          }}
        >
          新建分类
        </Button>
        <Form className={styles.form} form={form} onFinish={onFinish}>
          <Modal
            className={styles.modal}
            title={isCreate ? "新建分类" : "修改分类"}
            open={isModalOpen}
            onOk={form.submit}
            onCancel={handleCancel}
          >
            <Form.Item
              label="分类名称"
              name="category"
              rules={[{ required: true }]}
            >
              <Input allowClear />
            </Form.Item>
          </Modal>
        </Form>
      </div>
      <div>
        <Table
          loading={status === "loading"}
          columns={columns}
          dataSource={processData}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default CategoriesManagement;
