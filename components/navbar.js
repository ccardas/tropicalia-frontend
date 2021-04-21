import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";

import { Typography, Layout, Col, Menu, Row, Divider } from 'antd';
import { LoginOutlined, LogoutOutlined, AppstoreOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';

import styles from '../styles/Home.module.css'

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {

    const router = useRouter();
    const [session, _] = useSession();

    return (

    <Header style={{backgroundColor: '#FFFFFF'}}>
        <Row justify="space-between">
            <Col>
                <Row gutter={25}>
                    <Col>
                        <div className="logo">
                            <img src="/logo.svg" alg="TROPICAL-IA logo" className={styles.logo}></img>
                        </div>
                    </Col>
                    <Col>
                        <Menu mode="horizontal" defaultSelectedKeys={router.pathname}>
                            <Menu.Item key="/" icon={<HomeOutlined />}>
                            <Link href="/">Inicio</Link>
                            </Menu.Item>
                            {session &&
                                <Menu.Item key="/dashboard" icon={<AppstoreOutlined />}>
                                <Link href="/dashboard">Cuadro de mando</Link>
                                </Menu.Item>
                            }                
                            <Menu.Item key="/about" icon={<InfoCircleOutlined />}>
                            <Link href="/about">Acerca de TROPICAL-IA</Link>
                            </Menu.Item>
                        </Menu>
                    </Col>
                </Row>
            </Col>
            <Col>
                {session ? (
                    <>
                        <Text>
                            Bienvenido, { session.user.name }
                        </Text>
                        <Divider type="vertical" style={{ border: 0 }} />
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