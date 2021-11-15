import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";

import { Typography, Layout, Col, Menu, Row, Divider } from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  HomeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const router = useRouter();
  const [session, _] = useSession();

  return (
    <Header style={{ backgroundColor: "#FFF" }}>
      <Content style={{ padding: "0 50px" }}>
        <Row justify="space-between">
          <Col>
            <div className="logo">
              <Link href="/">
                <img src="/tropicalia/tropical-ia-02.svg" alg="TROPICAL-IA logo"></img>
              </Link>
            </div>
            <Menu mode="horizontal" defaultSelectedKeys={router.pathname}>
              <Menu.Item key="/" icon={<HomeOutlined />}>
                <Link href="/">Inicio</Link>
              </Menu.Item>
              <Menu.Item
                key="/dashboard"
                icon={<AppstoreOutlined />}
                disabled={!session}
              >
                <Link href="/dashboard">Cuadro de mando</Link>
              </Menu.Item>
              <Menu.Item key="/about" icon={<InfoCircleOutlined />}>
                <Link href="/about">Acerca de</Link>
              </Menu.Item>
            </Menu>
          </Col>
          <Col>
            {session ? (
              <>
                <Text>Bienvenid@ {session.user.name}</Text>
                <Divider type="vertical" style={{ border: 0 }} />
                <Text type="danger">
                  <a onClick={signOut}>
                    <LogoutOutlined />
                  </a>
                </Text>
              </>
            ) : (
              <>
                <a onClick={signIn}>
                  <Text>Iniciar sesión</Text>
                  <Divider type="vertical" style={{ border: 0 }} />
                  <LoginOutlined />
                </a>
              </>
            )}
          </Col>
        </Row>
      </Content>
    </Header>
  );
};

export default Navbar;
