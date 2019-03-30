import Link from 'next/link';
import Reset from '../theme/base/Reset';
import { GlobalStyles } from '../theme/nybraswire';

const Layout = ({ children }) => (
  <div>
    <Reset />
    <GlobalStyles />

    <header>
      <p>Logo</p>
    </header>

    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
    </nav>

    <main>
      {children}
    </main>

    <footer>
      <p>Copyright</p>
    </footer>
  </div>
);

export default Layout;
