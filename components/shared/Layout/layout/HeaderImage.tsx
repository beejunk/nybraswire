import { useContext } from 'react';
import ThemeContext from '../../../../theme';

const HeaderImage: React.FC = () => {
  const { header } = useContext(ThemeContext);

  return (
    <div
      className="HeaderImage"
      css={{
        backgroundImage: `url(${header})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '30vh',
        maxHeight: '250px',
      }}
    />
  );
};

export default HeaderImage;
