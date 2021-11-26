import { Space, Typography, Divider } from "antd";

import Table from "./Table";
import ImportTabularData from "./ImportTabularData";

const { Title, Text } = Typography;

const Dataset = () => {
  return (
    <>
      <Space style={{ width: "100%" }} direction="vertical">
        <Title level={2}>Visualización e interacción con los datos.</Title>
        <ImportTabularData />
        <Divider />
        <Text>
          En la siguiente tabla podrá añadir, modificar y eliminar datos.{" "}
        </Text>
        <Table />
      </Space>
      <Divider />
    </>
  );
};

export default Dataset;
