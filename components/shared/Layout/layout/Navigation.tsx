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

function logout(): void {
  firebase.auth().signOut();
}

const Navigation: React.FC = function Navigation() {
  let user = useAuth();
  let [open, setMenuState] = useState(false);

  return (
    <Navbar
      css={{ flexGrow: 1 }}
      dark
      color="primary"
      expand="md"
      className="mb-5"
    >
      <NavbarBrand
        className="flex-grow-1"
        tag={(props): React.ReactElement => (
          <Link href="/">
            <a className={props.className}>
              Nybraswire ::
              {' '}
              <small className="text-info">
                notes in code
              </small>
            </a>
          </Link>
        )}
      />

      {!user && (
        <>
          <a
            target="_blank"
            href="https://github.com/beejunk/nybraswire"
            rel="noopener noreferrer"
            css={{
              width: '1.5rem',
            }}
          >
            <img
              className="img-fluid"
              src="/assets/images/github_logo.png"
              alt="GitHub Logo"
            />
          </a>

          <a
            target="_blank"
            className="ml-2 mr-2"
            href="https://twitter.com/NybrasWire"
            rel="noopener noreferrer"
            css={{
              width: '1.5rem',
            }}
          >
            <img
              className="img-fluid"
              src="/assets/images/twitter_logo.png"
              alt="Twitter Logo"
            />
          </a>
        </>
      )}

      {user && (
        <>
          <NavbarToggler onClick={(): void => { setMenuState(!open); }} />

          <Collapse isOpen={open} navbar className="flex-grow-0">
            <Nav className="ml-auto" navbar>
              <NavItem className="mr-3">
                <NavLink
                  tag={(props): React.ReactElement => (
                    <Link as="/posts/create" href="/posts?create=true">
                      <a className={props.className}>
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
