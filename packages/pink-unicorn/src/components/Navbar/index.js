import { useState } from 'react'
import { NavLink as NavLinkRouter } from 'react-router-dom'
import qs from 'query-string'
import { fromPairs } from 'lodash'
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
  collections = [],
  menu = [],
  location,
} = {}) {
  const [ isOpen, setIsOpen ] = useState(false)
  const toggle = () => setIsOpen(!isOpen)
  const params = fromPairs(Array.from(new URLSearchParams(location?.search).entries()))

  return (
    <NavbarBootstrap color="light" light expand="md">
      <NavbarBrand to="/" tag={NavLinkRouter}>{document.title || 'pink-unicorn'}</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          {menu.map((item, index) => (
            <NavItem key={index}>
              <NavLink
                tag={NavLinkRouter}
                activeClassName="active"
                to={{
                  ...item.to,
                  search: `?${qs.stringify(params)}`,
                }}
              >
                {item.name}
              </NavLink>
            </NavItem>
          ))}
          {collections.map(collection => (
            <NavItem key={collection}>
              <NavLink
                tag={NavLinkRouter}
                activeClassName="active"
                to={{
                  pathname: `/${collection}/keys`,
                  search: `?${qs.stringify(params)}`,
                }}
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
