import { useSession } from "next-auth/client";
import { Space, Typography, Upload, Divider, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

import Table from "./Table";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const Dataset = () => {
  return (
    <>
      <Space style={{ width: "100%" }} direction="vertical">
        <Title level={2}>Visualización e interacción con los datos.</Title>
        <Text>En la siguiente tabla podrá añadir, modificar y eliminar datos. </Text>
        <Table />
      </Space>
      <Divider />
    </>
  );
};

export default Dataset;
