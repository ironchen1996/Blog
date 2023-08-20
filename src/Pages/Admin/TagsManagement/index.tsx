import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Space, Input, Tag, Tooltip, theme, message, Form, Button } from "antd";
import { useRequest } from "ahooks";
import {
  createTag,
  deleteTag,
  getAllTagsService,
  getTagService,
  tagType,
  updateTagService,
} from "../../../Services/tags";
import { processedTagNameData } from "../../../Utils/processedTagNameData";
import styles from "./index.module.scss";

const TagsManagement: React.FC = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [tags, setTags] = useState(["Unremovable"]);
  const [tagId, setTagId] = useState(1);
  const [inputVisible, setInputVisible] = useState(false);
  const [addButtonVisible, setAddButtonVisible] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [defultValue, setDefultValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  const { run: load, loading } = useRequest(
    async (requestData: tagType) => {
      const data = await getAllTagsService(requestData);
      return data;
    },
    {
      manual: true,
      onSuccess(result) {
        const tagName = processedTagNameData(result).map((tag) => tag.name);
        setTags(tagName);
      },
    }
  );

  const { run: addTag } = useRequest(
    async (name: string) => {
      const data = await createTag(name);
      return data;
    },
    {
      manual: true,
      onSuccess() {
        setTags([...tags, inputValue]);
        message.success("添加成功");
        setInputVisible(false);
        setInputValue("");
      },
      onError() {
        message.error("添加失败");
      },
    }
  );

  const { run: updateTag } = useRequest(
    async (id: number, name: string) => {
      const data = await updateTagService(id, name);
      return data;
    },
    {
      manual: true,
      onSuccess() {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        setTags(newTags);
        message.success("修改成功");
        setEditInputIndex(-1);
        setEditInputValue("");
      },
      onError(error) {
        const errorMessage =
          error.message === "Request failed with status code 409"
            ? "标签已存在"
            : "修改失败";
        message.error(errorMessage);
      },
    }
  );

  const onFinish = (value: any) => {
    const { tagName } = value;
    load({ keyword: tagName });
    setAddButtonVisible(false);
  };

  const reset = () => {
    load({});
    setAddButtonVisible(true);
  };

  useEffect(() => {
    load({});
  }, []);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleClose = async (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
    const tag = await getTagService({ keyword: removedTag });
    deleteTag(tag.id);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    message.error("取消修改");
    setInputVisible(false);
    setInputValue("");
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      addTag(inputValue);
    }
    setInputValue(inputValue);
  };

  const handleEditInputFocus = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setDefultValue(value);
    const tag = await getTagService({ keyword: value });
    setTagId(tag.id);
  };

  const handleEditInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputBlur = async () => {
    message.error("取消修改");
    setEditInputValue(defultValue);
  };

  const handleEditInputConfirm = async () => {
    updateTag(tagId, editInputValue);
    setEditInputValue(editInputValue);
  };

  const tagInputStyle: React.CSSProperties = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: "top",
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  return (
    <>
      <div>
        <Form className={styles.searchBox} form={form} onFinish={onFinish}>
          <Form.Item label="标签名" name="tagName" rules={[{ required: true }]}>
            <Input allowClear size="small" />
          </Form.Item>
          <Form.Item>
            <Button
              className={styles.button}
              size="small"
              htmlType="reset"
              onClick={reset}
            >
              重置
            </Button>
            <Button
              className={styles.button}
              size="small"
              type="primary"
              htmlType="submit"
            >
              检索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Space size={[0, 8]} wrap>
        <Space size={[0, 8]} wrap className={styles.tagBox}>
          {tags.map((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={editInputRef}
                  key={tag}
                  size="small"
                  style={tagInputStyle}
                  value={editInputValue}
                  onFocus={handleEditInputFocus}
                  onChange={handleEditInputChange}
                  onBlur={handleEditInputBlur}
                  onPressEnter={handleEditInputConfirm}
                />
              );
            }
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable={index !== 0}
                style={{ userSelect: "none" }}
                onClose={() => handleClose(tag)}
              >
                <span
                  onDoubleClick={(e) => {
                    if (index !== 0) {
                      setEditInputIndex(index);
                      setEditInputValue(tag);
                      e.preventDefault();
                    }
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {"tagElem"}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
          {inputVisible ? (
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={tagInputStyle}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onPressEnter={handleInputConfirm}
            />
          ) : (
            addButtonVisible && (
              <Tag style={tagPlusStyle} onClick={showInput}>
                <PlusOutlined /> 添加标签
              </Tag>
            )
          )}
        </Space>
      </Space>
    </>
  );
};

export default TagsManagement;
