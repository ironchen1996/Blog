import React, { FC, useEffect, useState } from "react";
import { Empty, Form, Select, SelectProps, Spin } from "antd";
import { useDebounceFn, useRequest } from "ahooks";
import { getTagsService } from "../../Services/tags";
import { TAG_LIST_PAGE_SIZE } from "../../Constants/PathName";
import { processTagOptionData } from "../../Utils/processTagOptionData";
import styles from "./index.module.scss";

interface tagSelectProps {
  mode: "multiple" | "tags" | undefined;
  size: "small" | "large" | undefined;
  initialTagValue?: Array<string>;
  styleStatus?: boolean;
  resetPage?: number;
  rules?: [{ required: true; message: "标签不能为空" }];
}

const TagPicker: FC<tagSelectProps> = ({
  mode,
  size,
  initialTagValue,
  styleStatus,
  resetPage,
  rules,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [tagList, setTagList] = useState<SelectProps["options"]>([]);
  const [totalTags, setTotalTags] = useState(0);
  const haveMorData = totalTags > (tagList ? tagList.length : 0);

  const { run: load, loading } = useRequest(
    async () => {
      const data = await getTagsService({
        page,
        limit: TAG_LIST_PAGE_SIZE,
        keyword: inputValue,
      });
      return data;
    },
    {
      manual: true,
      onSuccess(result) {
        const { data = {}, total = 0 } = result.data;
        const tagOption: SelectProps["options"] = data
          ? processTagOptionData(data)
          : [];
        setTagList(tagList?.concat(tagOption));
        setTotalTags(total);
        setPage(page + 1);
      },
    }
  );

  const { run: delayedSearch } = useDebounceFn(
    () => {
      if (inputValue.trim() !== "") {
        load();
      }
    },
    {
      wait: 500,
    }
  );

  const handleTagValueChange = (value: string) => {
    setInputValue(value);
    setPage(1);
    setTagList([]);
    delayedSearch();
  };

  const handleClear = () => {
    setPage(1);
    setTagList([]);
    load();
  };

  const { run: delayedScroll } = useDebounceFn(
    () => {
      load();
    },
    {
      wait: 500,
    }
  );

  const { run: delayedselect } = useDebounceFn(
    () => {
      load();
    },
    {
      wait: 300,
    }
  );

  const handleScroll = () => {
    if (haveMorData) {
      // setClearValue(true);
      delayedScroll();
    }
  };

  const handleSelected = () => {
    setInputValue("");
  };

  useEffect(() => {
    setPage(page - 1);
    load();
  }, []);

  useEffect(() => {
    if (inputValue === "") {
      setInputValue("");
      setPage(1);
      setTagList([]);
      delayedselect();
    }
  }, [inputValue]);

  useEffect(() => {
    setPage(resetPage || 1);
    setTagList([]);
    delayedScroll();
  }, [resetPage]);

  return (
    <>
      <Form.Item
        className={styleStatus ? styles.marginLeft : undefined}
        label="标签"
        name="tags"
        initialValue={initialTagValue !== null && initialTagValue}
        rules={rules}
      >
        <Select
          mode={mode}
          size={size}
          listHeight={100}
          notFoundContent={
            loading ? (
              <Spin className={styles.loadingStyle} size="small" />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )
          }
          defaultOpen={false}
          allowClear
          filterOption={(input, option) =>
            option?.label && typeof option.label === "string"
              ? option.label.toLowerCase().includes(input.toLowerCase())
              : false
          }
          options={tagList}
          onSearch={handleTagValueChange}
          onClear={handleClear}
          onSelect={handleSelected}
          onPopupScroll={handleScroll}
        />
      </Form.Item>
    </>
  );
};

export default TagPicker;
