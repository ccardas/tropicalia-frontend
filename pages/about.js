import BaseLayout from '../components/layout';
import { Typography, PageHeader, Col, Row, Carousel } from 'antd';

const { Text } = Typography;

const About = () => {
    return (
        <BaseLayout>
            <PageHeader className="site-page-header"></PageHeader>

            <Carousel autoplay>
                <div>
                    <Row justify="space-around">
                        <Col>
                            <img src="/trops.svg" style={{height: '40em'}} alg="TROPS logo"></img>
                        </Col>
                        <Col>
                            <Text>TROPS SAT 2803</Text>
                        </Col>
                    </Row>
                </div>
                <div>
                    <Row justify="space-around">
                        <Col>
                            <img src="/khaos.svg" style={{height: '40em'}} alg="Khaos logo"></img>
                        </Col>
                        <Col>
                            <Text>Khaos Research es un grupo de investigación perteneciente a la Universidad de Málaga.</Text>
                        </Col>
                    </Row>
                    
                </div>
                <div>
                    <Row justify="space-around">
                        <Col>
                            <img src="/uma.svg" style={{height: '40em'}} alg="UMA logo"></img>
                        </Col>
                        <Col>
                            <Text>La Universidad de Málaga</Text>
                        </Col>
                    </Row>
                </div>
            </Carousel>

        </BaseLayout>
    )
}

export default About;
