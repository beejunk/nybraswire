import Link from 'next/link';
import { Global } from '@emotion/core';
import reset from '../theme/reset';
import { typography } from '../theme';

const Layout = ({ children }) => (
  <div>
    <Global styles={reset} />
    <Global styles={typography} />

    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
      </nav>
    </header>

    <main>
      {children}
    </main>
  </div>
);

export default Layout;
