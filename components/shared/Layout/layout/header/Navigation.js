import Link from 'next/link';
import {
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
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
        <NavItem className="mr-3">
          <NavLink
            tag={props => (
              <Link as="/posts/create" href="/posts?create=true">
                <a {...props}>
                  Create Post
                </a>
              </Link>
            )}
          />
        </NavItem>

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
