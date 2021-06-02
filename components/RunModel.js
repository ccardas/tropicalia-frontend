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
import { useState } from "react";

const { Title, Text } = Typography;
const { SubMenu } = Menu;

const RunModel = () => {
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
  const [value, setValue] = useState(1);
  const [model, setModel] = useState("por seleccionar");
  const [cropType, setCropType] = useState("por seleccionar");

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  function onChange(e) {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  }

  function onClickModel(e) {
    console.log("model selected: ", e.key);
    setModel(e.key);
  }

  function onClickCropType(e) {
    console.log("crop selected: ", e.key);
    setCropType(e.key);
  }

  const doPrediction = () => {
    if (model == "por seleccionar" || cropType == "por seleccionar") {
      notification["error"]({
        message: "Se ha producido un error",
        description: "Por favor, seleccione una configuración válida",
      });
    } else {
      // TODO
    }
  };

  return (
    <>
      <Space direction="vertical">
        <Title level={2}>
          Realizar las predicciones de los cultivos de Mango y Aguacate.
        </Title>
        <Text>
          Por favor, seleccione un modelo y un conjunto de datos para recibir un
          resultado.
        </Text>
        <Text underline>
          Nota: En caso que el modelo seleccionado no esté previamente
          entrenado, esto tomará un tiempo, especialmente el modelo SARIMA, que
          ronda los 30-40 minutos de entrenamiento.
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

        <Radio.Group onChange={onChange} value={value}>
          <Radio style={radioStyle} value={1}>
            Predicción anual
          </Radio>
          <Radio style={radioStyle} value={2}>
            Predicción del siguiente mes
          </Radio>
        </Radio.Group>
        <Title level={5}>La configuración seleccionada es la siguiente:</Title>
        <Text>- Modelo: {model}</Text>
        <Text>- Cultivo: {cropType}</Text>
        <Button id="predButton" onClick={doPrediction}>
          Predecir
        </Button>
      </Space>
      <Divider />

      {/* TODO */}
    </>
  );
};

export default RunModel;
