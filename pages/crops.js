import BaseLayout from "../components/Layout";
import AccessDenied from "../components/AccessDenied";

import { PageHeader, Col, Row, Card, Divider } from "antd";
import { useSession } from "next-auth/client";


const { Meta } = Card;

const About = () => {
  
  const [session, loading] = useSession();

  // when rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null;

  // if no session exists, display access denied message
  if (!session)
    return (
      <BaseLayout>
        <AccessDenied />
      </BaseLayout>
    )

  return (
    <BaseLayout>
      <PageHeader className="site-page-header"></PageHeader>
      <Row justify="space-around" gutter={[20,24]}>
        <Col sm={8} xs={24}>
          <a href="https://khaos.uma.es/tropical-predict/explorer">
            <Card
              style={{ padding: "1em" }}
              hoverable
              cover={
                <img alt="tropical-predict_explorer" style={{ height: "18em" }} src="/tropicalia/mango_app_ficha.png" />
              }
            >
              <Meta title="App para añadir cultivos" description="www.khaos.uma.es/tropical-predict/explorer" />
            </Card>
          </a>
        </Col>
        <Col sm={12} xs={24}>
          <a href="https://khaos.uma.es/tropical-predict/visualization">
            <Card
              style={{ padding: "1em" }}
              hoverable
              cover={
                <img alt="visualization_app" style={{ height: "18em" }} src="/tropicalia/imagen_ficha.jpg" />
              }
            >
              <Meta
                title="App de visualización"
                description="www.khaos.uma.es/tropical-predict/visualization"
              />
            </Card>
          </a>
        </Col>
      </Row>
      <Divider />
    </BaseLayout>
  );
};

export default About;
