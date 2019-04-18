import { useContext } from 'react';
import Navigation from './header/Navigation';
import ThemeContext from '../../../../theme';

const Header = () => {
  const { header } = useContext(ThemeContext);

  return (
    <header
      className="Header"
      css={{
        backgroundImage: `url(${header})`,
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
};

export default Header;
