import BaseLayout from "../components/Layout";
import { PageHeader, Typography, Row, Col } from "antd";

const { Text, Title } = Typography;

const Home = () => {
  return (
    <BaseLayout>
      <PageHeader className="site-page-header"></PageHeader>
      <Title level={3}>
        Bienvenidos a la aplicación web del proyecto TROPICAL-IA
      </Title>
      <Text>
        Esta web es un portal de acceso a los datos recogidos y a las
        predicciones de los cultivos, producto de este proyecto, de manera
        sencilla y visual. Para ello, se requiere iniciar sesión y acceder a la
        sección "Cuadro de mando".
      </Text>
      <Row gutter={16} justify="space-between">
        <Col>
          <img
            alt="avocado"
            style={{ height: "19em", border: "1px solid black" }}
            src="/tropicalia/avocado.png"
          />
        </Col>
        <Col>
          <img
            alt="mango"
            style={{ height: "19em", border: "1px solid black" }}
            src="/tropicalia/mango.png"
          />
        </Col>
      </Row>
    </BaseLayout>
  );
};

export default Home;
