import { useState } from 'react'
import { NavLink as NavLinkRouter } from 'react-router-dom'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText
} from 'reactstrap'
import { collections } from '@/routes'

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand to="/" tag={NavLinkRouter}>{document.title || 'pink-unicorn'}</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          {collections.map(collection => (
            <NavItem key={collection}>
              <NavLink
                activeClassName="active"
                to={`/${collection}/keys`}
                tag={NavLinkRouter}
              >
                {collection}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <NavbarText>Version: {VERSION}</NavbarText>
      </Collapse>
    </Navbar>
  );
}

export default Example;
