import Link from 'next/link';

const Layout = ({ children }) => (
  <div>
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
