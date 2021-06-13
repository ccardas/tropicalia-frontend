import AccessDenied from "../components/AccessDenied";
import BaseLayout from "../components/Layout";
import Dataset from "../components/Dataset";
import RunModel from "../components/RunModel";
import TrainModel from "../components/TrainModel";

import { useSession } from "next-auth/client";
import { Divider, PageHeader, Typography, Tabs } from "antd";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Dashboard = () => {
  const [session, loading] = useSession();

  // when rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null;

  // if no session exists, display access denied message
  if (!session) return <AccessDenied />;

  //TODO: display options based on roles.
  return (
    <BaseLayout>
      <PageHeader className="site-page-header"></PageHeader>

      <Title>Bienvenido al cuadro de mando de la aplicación</Title>
      <Divider />

      <Tabs type="card" centered="true" size="large">
        <TabPane tab="Realizar una predicción" key="1">
          <RunModel />
        </TabPane>
        <TabPane tab="Entrenar un algoritmo" key="2">
          <Text italic="true">
            <TrainModel />
          </Text>
        </TabPane>
        <TabPane tab="Visualización de los datos" key="3">
          <Dataset />
        </TabPane>
      </Tabs>
    </BaseLayout>
  );
};

export default Dashboard;
