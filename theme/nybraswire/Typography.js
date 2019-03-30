import colors from './colors';

const Typography = () => (
  <style jsx global>
    {`
      html {
        font-size: 15px;
        font-family: Frutiger, "Frutiger Linotype", Univers, Calibri, "Gill Sans", "Gill Sans MT", "Myriad Pro", Myriad, "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif;
      }

      h1 {
        font-size: 4rem;
      }

      h2 {
        font-size: 3rem;
      }

      h3 {
        font-size: '2rem';
      }

      a, a:hover, a:visited, a:focus {
        color: ${colors.secondary};
        text-decoration: none;
      }
    `}
  </style>
);

export default Typography;
