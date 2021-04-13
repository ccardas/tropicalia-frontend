import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";

import { Typography, Layout, Col, Menu, Row } from 'antd';
import { LoginOutlined, LogoutOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {

    const router = useRouter();
    const [session, _] = useSession();

    return (

    <Header>
        <Row justify="space-between">

            <Col>
                <Menu mode="horizontal" defaultSelectedKeys={router.pathname}>
                    <Menu.Item key="/">
                    <Link href="/">Inicio</Link>
                    </Menu.Item>
                    {session &&
                        <Menu.Item key="/dashboard" disabled icon={<AppstoreOutlined />}>
                        <Link href="/dashboard">Cuadro de mando</Link>
                        </Menu.Item>
                    }                
                    <Menu.Item key="/about">
                    <Link href="/about">Acerca de TROPICAL-IA</Link>
                    </Menu.Item>
                </Menu>
            </Col>
            <Col>
                {session ? (
                    <>
                        <Text>
                            Bienvenido, { session.user.name }
                        </Text>
                        <Text>
                            <a onClick={signOut}>
                                <LogoutOutlined/>
                            </a>
                        </Text>
                    </>
                ) : (
                    <>
                        <a onClick={signIn}>
                            <LoginOutlined/>
                        </a>
                    </>
                )}
            </Col>
        </Row>
    </Header>



    );
}

export default Navbar;