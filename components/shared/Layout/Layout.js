import Head from 'next/head';
import { Col, Container, Row } from 'reactstrap';
import Header from './layout/Header';

const Layout = ({ title, children }) => (
  <div className="Layout">
    <Head>
      <title>{title}</title>
    </Head>

    <Header />

    <Container>
      <main>
        {children}
      </main>

      <footer>
        <Row className="border-top">
          <Col>
            <small className="text-muted">Copyright 2019 Brian David</small>
          </Col>
        </Row>
      </footer>
    </Container>

  </div>
);

export default Layout;
