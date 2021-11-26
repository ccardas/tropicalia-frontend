
import { useState } from "react";
import { useSession } from "next-auth/client";
import { Typography, Row, Col, Upload, message, Spin } from "antd";
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Paragraph } = Typography;

const ImportTabularData = () => {
  const [session] = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const uploadXLSX = (incoming) => {
    setIsLoading(true);
    const file = incoming.file;
    retrieveNewURL(file, (file, url) => {
      uploadFile(file, url);
    });
  }

  const retrieveNewURL = (file, cb) => {
    fetch(`/tropicalia/api/minio/upload?name=${file.name}`).then((res) => {
      if (res.ok) {
        res.text().then((url) => {
          cb(file, url);
        });        
      } else {
        const error = new Error(res.statusText);
        error.response = res;
        error.statusText = res.statusText;
        throw error;
      }
    }).catch((e) => {
      message.error("Error al subir el fichero. " + e.statusText, 5);
    });
  }

  const uploadFile = (file, url) => {
    // TODO: fix the catch error for nested fetchs
    // uploads file to the presigned MinIO URL
    fetch(url, {
      method: 'PUT',
      body: file
    })
    .then((res) => {
        if (res.ok) {
          return res;
        } else {
          const error = new Error(res.statusText);
          error.response = res;
          error.statusText = res.statusText;
          throw error;
        }
    })
    .then(() => {
      // then sends a request to the backend API with the uploaded file's name
      fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v1/data/update-xlsx?filename=${file.name}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      .then((res) => {
        if (res.ok) {
          message.success(file.name + " se ha subido correctamente.", 5)
        } else {
          const error = new Error(res.statusText);
          error.response = res;
          throw error;
        }
        setIsLoading(false);
      })
      
    })
    .catch((e) => {
        setIsLoading(false);
        message.error("Error al procesar el fichero. " + e.statusText, 5);
    });
  }

  return (
    <>
      <Row gutter={18}>
        <Col flex="1 35%">
          <Paragraph>
            Para poder actualizar el conjunto de datos representado en la tabla inferior, se permite añadir una hoja de cálculo (xlsx) que siga las siguientes normas en su formato:
          </Paragraph>
          <Paragraph>
            <ul>
              <li>
                Las únicas columnas que se deben incluir son "Fecha", "Tipo de cultivo" y "Kilos".
              </li>
              <li>
                El formato de la fecha debe ser "AAAA-MM-DD".
              </li>
              <li>
                Los nombres de los cultivos deben ser uniformes y corresponderse exactamente con aquellos considerados en esta web.
              </li>
              <li>
                Si se includen pares Fecha/Cultivo que ya consten en el histórico de datos, el valor nuevo reemplazará al antiguo.
              </li>
            </ul>
          </Paragraph>
        </Col>
        <Col flex="1 25%">
          <Dragger
            accept={".xlsx"}
            customRequest={uploadXLSX}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Seleccione o arrastre un fichero en este cuadro para subirlo</p>
            <p className="ant-upload-hint">
              Por favor, únicamente suba documentos que cumplan con el formato establecido
            </p>
          </Dragger>
        </Col>
      </Row>
      {isLoading && <Spin />}
    </>
  );
};

export default ImportTabularData;
