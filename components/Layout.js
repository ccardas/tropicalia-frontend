import { Divider, Layout } from "antd";

import Navbar from "./Navbar";

const { Content, Footer } = Layout;

const BaseLayout = (props) => {
  return (
    <Layout>
      <Navbar />
      <Content
        span={8}
        style={{ padding: "50px 50px 0 50px", width: "960px", margin: "auto" }}
      >
        <div
          className="site-layout-content"
          style={{ padding: 24, minHeight: 380 }}
        >
          {props.children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        TROPICAL-IA [Build, Deploy, Scale] ©2021 Khaos Research Group
      </Footer>
    </Layout>
  );
};

export default BaseLayout;
