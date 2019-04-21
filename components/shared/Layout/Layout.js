import Head from 'next/head';
import { Container } from 'reactstrap';
import Header from './layout/Header';

const Layout = ({ title, children }) => (
  <div className="Layout">
    <Head>
      <title>{title}</title>
    </Head>

    <Header />

    <main>
      <Container>
        {children}
      </Container>
    </main>

    <footer>
      <p>Copyright</p>
    </footer>
  </div>
);

export default Layout;
