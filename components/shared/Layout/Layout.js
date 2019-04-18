import { Container } from 'reactstrap';
import Header from './layout/Header';

const Layout = ({ children }) => (
  <div className="Layout">
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
