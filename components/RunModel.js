import { useSession } from "next-auth/client";
import {
  Row,
  Col,
  Button,
  Space,
  Typography,
  Radio,
  Select,
  Cascader,
  Alert,
  notification,
} from "antd";
import { useEffect, useState, encodedURIComponent } from "react";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const cropTypesOptions = [
  {
    value: 'Mango',
    label: 'Mango',
    children: [
      {
        value: 'Mango Genérico',
        label: 'Mango Genérico'
      },
      {
        value: 'Mango Irwin',
        label: 'Mango Irwin'
      },
      {
        value: 'Mango Keitt',
        label: 'Mango Keitt'
      },
      {
        value: 'Mango Kent',
        label: 'Mango Kent'
      },
      {
        value: 'Mango Manzanillo',
        label: 'Mango Manzanillo'
      },
      {
        value: 'Mango Osteen',
        label: 'Mango Osteen'
      },

      {
        value: 'Mango Palmer',
        label: 'Mango Palmer'
      },

      {
        value: 'Mango Sensation',
        label: 'Mango Sensation'
      },

      {
        value: 'Mango Tommy Atkins',
        label: 'Mango Tommy Atkins'
      },
    ],
  },
  {
    value: 'Aguacate',
    label: 'Aguacate',
    children: [
      {
        value: 'Aguacate Bacon',
        label: 'Aguacate Bacon'
      },
      {
        value: 'Aguacate Cocktail',
        label: 'Aguacate Cocktail'
      },
      {
        value: 'Aguacate Fuerte',
        label: 'Aguacate Fuerte'
      },
      {
        value: 'Aguacate Gween',
        label: 'Aguacate Gween'
      },
      {
        value: 'Aguacate Hass',
        label: 'Aguacate Hass'
      },
      {
        value: 'Aguacate Lamb Hass',
        label: 'Aguacate Lamb Hass'
      },
      {
        value: 'Aguacate Maluma Hass',
        label: 'Aguacate Maluma Hass'
      },
      {
        value: 'Aguacate Melón',
        label: 'Aguacate Melón'
      },
      {
        value: 'Aguacate Pinkerton',
        label: 'Aguacate Pinkerton'
      },
      {
        value: 'Aguacate Reed',
        label: 'Aguacate Reed'
      },
      {
        value: 'Aguacate Zutano',
        label: 'Aguacate Zutano'
      },
    ],
  },
];

const RunModel = () => {

  const [session] = useSession();
  const [value, setValue] = useState(1);
  const [model, setModel] = useState();
  const [cropType, setCropType] = useState();
  const [message, setMessage] = useState();

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  function onChange(e) {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  }

  function onSelectModel(e) {
    console.log("model selected: ", e);
    setModel(e);
  }

  function onSelectCropType(e) {
    console.log("crop selected: ", e);
    setCropType(e[e.length - 1]);
  }

  const doPrediction = () => {
    if (!doCheckModel(model, cropType)) {
      notification["error"]({
        message: "El modelo seleccionado no está entrenado",
        description:
          "Por favor, entrene el modelo en la sección de entrenamiento.",
      });
    } else {
      // TODO
    }
  };

  const doCheckModel = async (m, ct) => {
    await fetch(
      `http://0.0.0.0:8001/api/v1/algorithm/check?algorithm=${m}&crop_type=${ct}`,
      {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`
        },
      }
    ).then((res) => {
      if ((res.ok) || (res.status == 404)) { 
        return res.json();
      }
      return res.text().then(text => {throw new Error(text)})
    })
    .then((result) => { 
      if (result.detail == "The specified combination has not been trained.") {
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
          Nueva predicción de los cultivos de Mango y Aguacate
        </Title>
        <Paragraph>
          Por favor, seleccione un modelo y un conjunto de datos para recibir un
          resultado.
        </Paragraph>
        <Paragraph>
          <Alert
            message="El entrenamiento de un modelo puede llevar varios minutos en el caso de que no esté previamente
            entrenado."
            type="warning"
            showIcon
            closable
          />
        </Paragraph>
        <Row gutter={16}>
          <Col span={12}>
            <Select placeholder="Selecciona un modelo" style={{ width: '100%' }} onChange={m => onSelectModel(m)}>
              <Option value="SARIMA">SARIMA</Option>
              <Option value="Prophet">Prophet</Option>
              <Option value="%">Todos los modelos</Option>
            </Select>
          </Col>
          <Col span={12}>
            <Cascader placeholder="Elija el tipo de cultivo"
              style={{ width: '100%' }} options={cropTypesOptions} onChange={c => onSelectCropType(c)} />
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

        { message && (
          <Alert message={message} type="info" />
        )}

        <Button type="primary" onClick={doPrediction} block disabled={!model || !cropType}>
          Predecir
        </Button>
      </Space>
    </>
  );
};

export default RunModel;
