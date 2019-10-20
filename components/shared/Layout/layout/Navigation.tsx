import React, { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import firebase from '../../../../firebase';
import useAuth from '../../../../hooks/useAuth';

const logout = (): void => {
  firebase.auth().signOut();
};

const Navigation: React.FC = () => {
  const user = useAuth();
  const [open, setMenuState] = useState(false);

  return (
    <Navbar
      css={{ flexGrow: 1 }}
      dark
      color="primary"
      expand="md"
      className="mb-5"
    >
      <NavbarBrand
        tag={(props): React.ReactElement => (
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
        <>
          <NavbarToggler onClick={(): void => { setMenuState(!open); }} />

          <Collapse isOpen={open} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem className="mr-3">
                <NavLink
                  tag={(props): React.ReactElement => (
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
          </Collapse>
        </>
      )}
    </Navbar>
  );
};

export default Navigation;
