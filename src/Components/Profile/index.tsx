import React, { FC, useEffect } from "react";
import styles from "./index.module.scss";
import {
  GithubOutlined,
  WechatOutlined,
  MailOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { Avatar, Button, theme, Card } from "antd";
import { fetchUserProfile } from "../../Features/User/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RootDispatch } from "../../Store";

const { useToken } = theme;

const Profile: FC = () => {
  const { token } = useToken();

  const dispatch: RootDispatch = useDispatch();
  const userProfile = useSelector(
    (state: RootState) => state.user.userProfile[1]
  );

  const handleEmailButtonClick = () => {
    const recipientEmail = userProfile?.email; // 设置你的邮箱地址
    const mailtoURL = `mailto:${recipientEmail}`;

    window.open(mailtoURL);
  };

  useEffect(() => {
    dispatch(fetchUserProfile(1));
  }, []);

  return (
    <>
      <Card
        style={{
          backgroundColor: token.colorBgBase,
          width: 300,
          borderRadius: "10px",
        }}
      >
        <div className={styles.avatar}>
          <Avatar size={128} src={userProfile?.avatar} />
        </div>
        <div className={styles.introduction}>
          <h1>{userProfile?.nickname}</h1>
          <text>{userProfile?.introduction}</text>
        </div>
        <div className={styles.socialMedia}>
          <span>
            <Button
              icon={<GithubOutlined />}
              size="large"
              shape="circle"
              type="link"
            />
          </span>
          <span>
            <Button
              icon={<MailOutlined />}
              size="large"
              shape="circle"
              type="link"
              onClick={handleEmailButtonClick}
            />
          </span>
          <span>
            <Button
              icon={<WechatOutlined />}
              size="large"
              shape="circle"
              type="link"
            />
          </span>
          <span>
            <Button
              icon={<LinkedinOutlined />}
              size="large"
              shape="circle"
              type="link"
            />
          </span>
        </div>
      </Card>
    </>
  );
};

export default Profile;
