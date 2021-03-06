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
  Table,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { Chart } from "react-charts";
import { CSVLink } from "react-csv";

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

const RunModel = () => {
  const [session] = useSession();
  const [value, setValue] = useState(1);
  const [model, setModel] = useState();
  const [cropType, setCropType] = useState();
  const [message, setMessage] = useState();
  const [dataChart, setDataChart] = useState();
  const [seriesChart, setSeriesChart] = useState();
  const [axesChart, setAxesChart] = useState();
  const [tableData, setTableData] = useState();
  const [tableCols, setTableCols] = useState();
  const [training, setTraining] = useState();

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  function onChange(e) {
    setValue(e.target.value);
  }

  function onSelectModel(e) {
    setModel(e);
  }

  function onSelectCropType(e) {
    setCropType(e[e.length - 1]);
  }

  function round(value, precision = 2) {
    return Number(Math.round(value + 'e' + precision) + 'e-' + precision);
  }

  function getDataChart(rawLyData, rawPredData, rawForecastData) {
    var lyData = [];
    var predData = [];
    var forecastData = [];
    var i, date;

    for (i = 0; i < rawPredData.length; i++) {
      date = new Date(rawPredData[i].date);
      predData.push({
        primary: date,
        secondary: rawPredData[i].yield_values,
      });
    }

    for (i = 0; i < rawLyData.length; i++) {
      date = new Date(rawLyData[i].date);
      lyData.push({
        primary: date,
        secondary: rawLyData[i].yield_values + 0.001,
      });
    }

    for (i = 0; i < rawForecastData.length; i++) {
      date = new Date(rawForecastData[i].date);
      forecastData.push({
        primary: date,
        secondary: rawForecastData[i].yield_values,
      });
    }

    const chart = [
      {
        label: "Datos reales",
        data: lyData,
      },
      {
        label: "Datos predichos",
        data: predData,
      },
      {
        label: "Pronóstico para el próximo año",
        data: forecastData,
      },
    ];

    const series = {
      type: "line",
      showPoints: false,
    };

    const axes = [
      {
        primary: true,
        type: "time",
        position: "bottom",
      },
      {
        type: "linear",
        position: "left",
      },
    ];

    return [chart, series, axes];
  }

  function getTable(rawLyData, rawForecastData) {
    var dataSource = [];
    var i, obj, len, real, forecast;
    const columns = [
      {
        title: "Mes",
        dataIndex: "month",
        key: "month",
      },
      {
        title: "Valor real",
        dataIndex: "real",
        key: "real",
      },
      {
        title: "Pronóstico año siguiente",
        dataIndex: "forecast",
        key: "forecast",
      },
      {
        title: "Diferencia",
        dataIndex: "difference",
        key: "difference",
      },
    ];
    len = rawForecastData.length;
    for (i = 0; i < len; i++) {
      real = rawLyData[rawLyData.length - len + i].yield_values;
      forecast = rawForecastData[i].yield_values;

      obj = {
        key: i,
        month: rawForecastData[i].date.split("-")[1],
        real: round(real),
        forecast: round(forecast),
        difference: round(Math.abs(real - forecast)),
      };
      dataSource.push(obj);
    }

    return [dataSource, columns];
  }

  const doPrediction = async () => {
    setTraining(true);
    const isMonthly = value == 1 ? false : true;
    await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/api/v1/algorithm/predict?algorithm=${model}&crop_type=${cropType}&is_monthly=${isMonthly}`,
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
        if (result.detail == "Data prediction failed") {
          const msg = `Ha ocurrido un error durante el entrenamiento.`;
          setMessage(msg);
        } else {
          if (!isMonthly) {
            const [chart, series, axes] = getDataChart(
              result.last_year_data.data,
              result.prediction.data,
              result.forecast.data
            );
            setDataChart(chart);
            setSeriesChart(series);
            setAxesChart(axes);
          }

          const [tData, tCols] = getTable(
            result.last_year_data.data,
            result.forecast.data
          );
          setTableData(tData);
          setTableCols(tCols);
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
      process.env.NEXT_PUBLIC_API_URL + `/api/v1/algorithm/check?algorithm=${m}&crop_type=${ct}`,
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

        <Radio.Group onChange={onChange} value={value}>
          <Radio style={radioStyle} value={1}>
            Predicción anual
          </Radio>
          <Radio style={radioStyle} value={2}>
            Predicción del siguiente mes
          </Radio>
        </Radio.Group>

        {message && <Alert message={message} type="info" />}

        {training && <Spin />}

        <Button
          type="primary"
          onClick={doPrediction}
          block
          disabled={!model || !cropType}
        >
          Predecir
        </Button>

        {dataChart && seriesChart && axesChart && (
          <div style={{
            width: "100%",
            height: "calc(100vh - 400px)",
          }}>
            <Chart
              data={dataChart}
              series={seriesChart}
              axes={axesChart}
              tooltip
            />
          </div>
          
        )}

        {tableData && tableCols && (
          <>
            <Table
              dataSource={tableData}
              columns={tableCols}
              pagination={false}
              style={{
                width: "100%",
              }}
            />
            <Button>
              <CSVLink filename={"prediccion.csv"} data={tableData}>
                Exportar como CSV
              </CSVLink>
            </Button>
          </>
        )}
      </Space>
    </>
  );
};

export default RunModel;
