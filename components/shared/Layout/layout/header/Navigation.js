import Link from 'next/link';
import {
  Navbar,
  NavbarBrand,
} from 'reactstrap';

const Navigation = () => (
  <Navbar
    css={{ flexGrow: 1 }}
    dark
    color="primary"
  >
    <NavbarBrand
      tag={props => (
        <Link href="/">
          <a {...props}>
            Nybraswire ::
            {' '}
            <small className="text-info">
                notes in code
            </small>
          </a>
        </Link>
      )}
    />
  </Navbar>
);

export default Navigation;
