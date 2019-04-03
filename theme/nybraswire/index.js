import colors from './colors';
import Reset from './Reset';
import Typography from './Typography';

export const GlobalStyles = () => (
  <>
    <Reset />
    <Typography />
  </>
);

export const theme = {
  colors,
};
