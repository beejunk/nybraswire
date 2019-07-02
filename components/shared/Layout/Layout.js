// @flow

import React from 'react';
import type { ChildrenArray, Element } from 'react';
import Head from 'next/head';
import { Col, Container, Row } from 'reactstrap';
import HeaderImage from './layout/HeaderImage';
import Navigation from './layout/Navigation';

type Props = {
  title: string,
  children: ChildrenArray<Element<any>>,
};

const Layout = ({ title, children }: Props) => (
  <div className="Layout">
    <Head>
      <title>{title}</title>
    </Head>

    <header>
      <HeaderImage />
      <Navigation />
    </header>

    <Container>
      <main css={{ marginBottom: '1rem' }}>
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
