import BaseLayout from "../components/Layout";
import { Typography, PageHeader, Col, Row, Card, Anchor, Divider } from "antd";

const { Text } = Typography;
const { Meta } = Card;

const About = () => {
  return (
    <BaseLayout>
      <PageHeader className="site-page-header"></PageHeader>
      <Row justify="space-around" gutter={[48, 24]}>
        <Col sm={8} xs={24}>
          <a href="https://www.trops.es">
            <Card
              style={{ padding: "1em" }}
              hoverable
              cover={
                <img alt="trops" style={{ height: "18em" }} src="/trops.svg" />
              }
            >
              <Meta title="TROPS, SAT 2803" description="www.trops.es" />
            </Card>
          </a>
        </Col>
        <Col sm={8} xs={24}>
          <a href="https://khaos.uma.es">
            <Card
              style={{ padding: "1em" }}
              hoverable
              cover={
                <img alt="khaos" style={{ height: "18em" }} src="/khaos.svg" />
              }
            >
              <Meta
                title="Khaos Research Group"
                description="www.khaos.uma.es"
              />
            </Card>
          </a>
        </Col>
        <Col sm={8} xs={24}>
          <a href="https://uma.es">
            <Card
              style={{ padding: "1em" }}
              hoverable
              cover={
                <img alt="uma" style={{ height: "18em" }} src="/uma.svg" />
              }
            >
              <Meta title="Universidad de Málaga" description="www.uma.es" />
            </Card>
          </a>
        </Col>
      </Row>
      <Divider />
      <Text>
        El proyecto TROPICAL-IA es un proyecto desarrollado por el grupo de
        investigación Khaos con el agente agregado TROPS, SAT 2803. Este
        proyecto pretende realizar un análisis de series temporales sobre los
        datos recogidos de los cultivos tropicales de mango y aguacate de la
        provincia de Málaga.
      </Text>
    </BaseLayout>
  );
};

export default About;
