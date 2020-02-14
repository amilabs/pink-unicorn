import { useState } from 'react'
import { NavLink as NavLinkRouter } from 'react-router-dom'
import {
  Collapse,
  Navbar as NavbarBootstrap,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText
} from 'reactstrap'

export default function Navbar ({
  collections = []
} = {}) {
  const [ isOpen, setIsOpen ] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  return (
    <NavbarBootstrap color="light" light expand="md">
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
    </NavbarBootstrap>
  )
}
