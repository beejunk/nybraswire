import Link from 'next/link';
import {
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
} from 'reactstrap';
import withAuth from '../../../withAuth';
import firebase from '../../../../../firebase';

const logout = () => {
  firebase.auth().signOut();
};

const Navigation = ({ user }) => (
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

    {user && (
      <Nav>
        <NavItem>
          <Button onClick={logout} color="info">
            Log out
          </Button>
        </NavItem>
      </Nav>
    )}
  </Navbar>
);

export default withAuth(Navigation);
