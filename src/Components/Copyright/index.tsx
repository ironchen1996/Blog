import React, { FC } from "react";
import styles from "./index.module.scss";

interface footerInfoProps {
  footerInfo: string;
}

const Copyright: FC<footerInfoProps> = ({ footerInfo }) => {
  return (
    <div className={styles.footer}>
      <p>{footerInfo}</p>
      <p>© 2023 Copyright IronChen</p>
    </div>
  );
};

export default Copyright;
