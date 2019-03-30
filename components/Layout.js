import Link from 'next/link';
import { Global } from '@emotion/core';
import base from '../theme/base';
import { globalStyles } from '../theme/nybraswire';

const Layout = ({ children }) => (
  <div>
    <Global styles={base} />
    <Global styles={globalStyles} />

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
