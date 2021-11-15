import { useSession } from "next-auth/client";
import {
  Row,
  Col,
  Button,
  Space,
  Typography,
  Select,
  Cascader,
  Alert,
  notification,
  Spin,
} from "antd";
import { useEffect, useState } from "react";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const cropTypesOptions = [
  {
    value: "mango",
    label: "Mango",
    children: [
      {
        value: "Mango",
        label: "Todas las variedades",
      },
      {
        value: "Mango Genérico",
        label: "Mango Genérico",
      },
      {
        value: "Mango Irwin",
        label: "Mango Irwin",
      },
      {
        value: "Mango Keitt",
        label: "Mango Keitt",
      },
      {
        value: "Mango Kent",
        label: "Mango Kent",
      },
      {
        value: "Mango Manzanillo",
        label: "Mango Manzanillo",
      },
      {
        value: "Mango Osteen",
        label: "Mango Osteen",
      },

      {
        value: "Mango Palmer",
        label: "Mango Palmer",
      },

      {
        value: "Mango Sensation",
        label: "Mango Sensation",
      },

      {
        value: "Mango Tommy Atkins",
        label: "Mango Tommy Atkins",
      },
    ],
  },
  {
    value: "aguacate",
    label: "Aguacate",
    children: [
      {
        value: "Aguacate",
        label: "Todas las variedades",
      },
      {
        value: "Aguacate Bacon",
        label: "Aguacate Bacon",
      },
      {
        value: "Aguacate Cocktail",
        label: "Aguacate Cocktail",
      },
      {
        value: "Aguacate Fuerte",
        label: "Aguacate Fuerte",
      },
      {
        value: "Aguacate Gween",
        label: "Aguacate Gween",
      },
      {
        value: "Aguacate Hass",
        label: "Aguacate Hass",
      },
      {
        value: "Aguacate Lamb Hass",
        label: "Aguacate Lamb Hass",
      },
      {
        value: "Aguacate Maluma Hass",
        label: "Aguacate Maluma Hass",
      },
      {
        value: "Aguacate Melón",
        label: "Aguacate Melón",
      },
      {
        value: "Aguacate Pinkerton",
        label: "Aguacate Pinkerton",
      },
      {
        value: "Aguacate Reed",
        label: "Aguacate Reed",
      },
      {
        value: "Aguacate Zutano",
        label: "Aguacate Zutano",
      },
    ],
  },
];

const TrainModel = () => {
  const [session] = useSession();
  const [model, setModel] = useState();
  const [cropType, setCropType] = useState();
  const [message, setMessage] = useState();
  const [training, setTraining] = useState();

  function onSelectModel(e) {
    setModel(e);
  }

  function onSelectCropType(e) {
    setCropType(e[e.length - 1]);
  }

  const doTrain = async () => {
    setTraining(true);
    await fetch(
      `/tropicalia/fastapi/api/v1/algorithm/train?algorithm=${model}&crop_type=${cropType}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    )
      .then((res) => {
        if (res.ok || res.status == 404) {
          return res.json();
        }
        return res.text().then((text) => {
          throw new Error(text);
        });
      })
      .then((result) => {
        if (result.detail == "Algorithm training failed") {
          const msg = `Ha ocurrido un error durante el entrenamiento del modelo.`;
          setMessage(msg);
        } else {
          const msg = `El modelo se ha entrenado correctamente con datos hasta la fecha: ${result.last_date}`;
          setMessage(msg);
        }
      })
      .catch((err) => {
        notification["error"]({
          message: "Ha ocurrido un error al conectarse con el servidor",
          description: `${err}`,
        });
      });
    setTraining(false);
  };

  const doCheckModel = async (m, ct) => {
    await fetch(
      `/tropicalia/fastapi/api/v1/algorithm/check?algorithm=${m}&crop_type=${ct}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    )
      .then((res) => {
        if (res.ok || res.status == 404) {
          return res.json();
        }
        return res.text().then((text) => {
          throw new Error(text);
        });
      })
      .then((result) => {
        if (
          result.detail == "The specified combination has not been trained."
        ) {
          const msg = `La combinación especificada no ha sido entrenada.`;
          setMessage(msg);
        } else {
          const msg = `La combinación seleccionada está entrenada con datos hasta la fecha: ${result.last_date}`;
          setMessage(msg);
        }
      })
      .catch((err) => {
        notification["error"]({
          message: "Ha ocurrido un error al conectarse con el servidor",
          description: `${err}`,
        });
      });
  };

  useEffect(() => {
    if (model && cropType) {
      doCheckModel(model, cropType);
    }
  }, [model, cropType]);

  return (
    <>
      <Space direction="vertical" size={10}>
        <Title level={3}>
          Entrenamiento de los modelos para los datos de Mango y Aguacate
        </Title>
        <Paragraph>
          Por favor, seleccione un modelo y un conjunto de datos para entrenar
          el modelo.
        </Paragraph>
        <Paragraph>
          <Alert
            message="El entrenamiento de un modelo puede llevar varios minutos."
            type="warning"
            showIcon
            closable
          />
        </Paragraph>

        <Row gutter={16}>
          <Col span={12}>
            <Select
              placeholder="Selecciona un modelo"
              style={{ width: "100%" }}
              onChange={(m) => onSelectModel(m)}
            >
              <Option value="SARIMA">SARIMA</Option>
              <Option value="Prophet">Prophet</Option>
              {/* <Option value="%">Todos los modelos</Option> */}
            </Select>
          </Col>
          <Col span={12}>
            <Cascader
              placeholder="Elija el tipo de cultivo"
              style={{ width: "100%" }}
              options={cropTypesOptions}
              onChange={(c) => onSelectCropType(c)}
            />
          </Col>
        </Row>

        {message && <Alert message={message} type="info" />}

        {training && <Spin />}

        <Button
          type="primary"
          onClick={doTrain}
          block
          disabled={!model || !cropType}
        >
          Entrenar
        </Button>
      </Space>
    </>
  );
};

export default TrainModel;
