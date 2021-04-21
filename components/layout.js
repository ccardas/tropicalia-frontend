import { Layout } from "antd";

import Navbar from "./navbar";

const { Content, Footer } = Layout;

const BaseLayout = (props) => {

    return (
        <Layout className="layout">
            <Navbar />
            <Content style={{ padding: "0 50px" }}>
                <div className="site-layout-content">{props.children}</div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
                TROPICAL-IA [Build, Deploy, Scale] ©2021 Khaos Research Group
            </Footer>
        </Layout>
    )
}

export default BaseLayout;