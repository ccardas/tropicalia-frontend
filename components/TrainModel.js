import { useSession } from "next-auth/client";
import {
  Menu,
  Dropdown,
  Row,
  Col,
  Divider,
  Button,
  Space,
  Typography,
  Radio,
  notification,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState, encodedURIComponent } from "react";

const { Title, Text } = Typography;
const { SubMenu } = Menu;

const TrainModel = () => {
  const modelSelection = (
    <Menu onClick={onClickModel}>
      <Menu.ItemGroup>
        <Menu.Item key="SARIMA">SARIMA</Menu.Item>
        <Menu.Item key="SARIMAX">SARIMAX</Menu.Item>
        <Menu.Item key="Prophet">Prophet</Menu.Item>
        <Menu.Item key="LSTM">LSTM</Menu.Item>
        <Menu.Item key="HWES">HWES</Menu.Item>
        <Menu.Item key="XGBoost">XGBoost</Menu.Item>
        <Menu.Item key="SVM">SVM</Menu.Item>
        <Menu.Item key="%">Todos los modelos</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  const modelSelectionClient = (
    <Menu onClick={onClickModel}>
      <Menu.ItemGroup>
        <Menu.Item key="SARIMA">SARIMA</Menu.Item>
        <Menu.Item key="Prophet">Prophet</Menu.Item>
        <Menu.Item key="%">Todos los modelos</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  const cropSelection = (
    <Menu onClick={onClickCropType}>
      <SubMenu key="Aguacate" title="Aguacate">
        <Menu.Item key="Aguacate Bacon">Aguacate Bacon</Menu.Item>
        <Menu.Item key="Aguacate Cocktail">Aguacate Cocktail</Menu.Item>
        <Menu.Item key="Aguacate Fuerte">Aguacate Fuerte</Menu.Item>
        <Menu.Item key="Aguacate Gween">Aguacate Gween</Menu.Item>
        <Menu.Item key="Aguacate Hass">Aguacate Hass</Menu.Item>
        <Menu.Item key="Aguacate Lamb Hass">Aguacate Lamb Hass</Menu.Item>
        <Menu.Item key="Aguacate Maluma Hass">Aguacate Maluma Hass</Menu.Item>
        <Menu.Item key="Aguacate Melón">Aguacate Melón</Menu.Item>
        <Menu.Item key="Aguacate Pinkerton">Aguacate Pinkerton</Menu.Item>
        <Menu.Item key="Aguacate Reed">Aguacate Reed</Menu.Item>
        <Menu.Item key="Aguacate Zutano">Aguacate Zutano</Menu.Item>
        <Menu.Item key="Aguacate">Todas las variedades</Menu.Item>
      </SubMenu>
      <SubMenu title="Mango">
        <Menu.Item key="Mango Genérico">Mango Genérico</Menu.Item>
        <Menu.Item key="Mango Irwin">Mango Irwin</Menu.Item>
        <Menu.Item key="Mango Keitt">Mango Keitt</Menu.Item>
        <Menu.Item key="Mango Kent">Mango Kent</Menu.Item>
        <Menu.Item key="Mango Manzanillo">Mango Manzanillo</Menu.Item>
        <Menu.Item key="Mango Osteen">Mango Osteen</Menu.Item>
        <Menu.Item key="Mango Palmer">Mango Palmer</Menu.Item>
        <Menu.Item key="Mango Sensation">Mango Sensation</Menu.Item>
        <Menu.Item key="Mango Tommy Atkins">Mango Tommy Atkins</Menu.Item>
        <Menu.Item key="Mango">Todas las variedades</Menu.Item>
      </SubMenu>
    </Menu>
  );

  const [session] = useSession();
  const [model, setModel] = useState("por seleccionar");
  const [cropType, setCropType] = useState("por seleccionar");

  function onClickModel(e) {
    console.log("model selected: ", e.key);
    setModel(e.key);
  }

  function onClickCropType(e) {
    console.log("crop selected: ", e.key);
    setCropType(e.key);
  }

  const checkModel = (m, ct) => {
    if (m && ct) {
      //const response = fetch(`http://0.0.0.0:8001/`, {
      const response = fetch(
        `http://0.0.0.0:8001/api/v1/algorithm/check?algorithm=${m}&crop_type=${ct}`,
        {
          method: "GET",
          header: { "Content-Type": "application/json" },
        }
      );
      const isTrained = response;
      if (isTrained) {
        // TODO: if the selected model is trained, notify the user.
      } else {
        // TODO: if the selected model is not trained, notify the user
      }

      return isTrained;
    }
  };

  useEffect(() => {
    checkModel(model, cropType);
  }, [model, cropType]);

  return (
    <>
      <Space direction="vertical">
        <Title level={3}>Entrenar los modelos para los cultivos.</Title>
        <Text>
          Por favor, seleccione un modelo y un conjunto de datos para entrenar
        </Text>
        <Text underline>
          Nota: El entrenamiento de los modelos puede tomar una cantidad de
          tiempo considerable. Especialmente el modelo SARIMA, que ronda los
          30-40 minutos de entrenamiento.
        </Text>

        <Row justify="space-around" style={{ marginTop: "1%" }}>
          <Col style={{ width: "49%" }}>
            {session.user.name == "Demo" ? (
              <Dropdown overlay={modelSelection}>
                <Button className="ant-dropdown-link" style={{ width: "100%" }}>
                  Seleccione un modelo <DownOutlined />
                </Button>
              </Dropdown>
            ) : (
              <Dropdown overlay={modelSelectionClient}>
                <Button className="ant-dropdown-link" style={{ width: "100%" }}>
                  Seleccione un modelo <DownOutlined />
                </Button>
              </Dropdown>
            )}
          </Col>
          <Divider type="vertical" style={{ border: 0 }} />
          <Col style={{ width: "49%" }}>
            <Dropdown overlay={cropSelection}>
              <Button className="ant-dropdown-link" style={{ width: "100%" }}>
                Elija el tipo de cultivo <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </Space>
    </>
  );
};

export default TrainModel;
