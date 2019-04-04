import Navigation from './header/Navigation';

const Header = () => (
  <header
    className="Header"
    css={{
      backgroundImage: 'url(/static/images/header.jpg)',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      height: '30vh',
      maxHeight: '300px',
      display: 'flex',
      alignItems: 'flex-end',
    }}
  >
    <Navigation />
  </header>
);

export default Header;
