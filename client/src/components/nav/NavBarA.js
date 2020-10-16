import React, { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import { useAuth0 } from '@auth0/auth0-react';
import Settings from '../Park/Settings/Settings';
import AddFeature from '../Park/Features/AddFeature';

export default function NavBarA(props) {
    const [ isOpen, setIsOpen ] = useState(false);
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
    const [ parkName, setParkName ] = useState(props.parkName);
    const [ newPark, setNewPark ] = useState();

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
      setParkName(props.parkName)
    }, [props.parkName])

    useEffect(() => {
      setNewPark(props.newPark)
    }, [props.newPark])

    return (
        <div style={{
          position: 'absolute',
          zIndex: 10,
          width: '100%',
      }}>
        <Navbar light expand="md">
          <NavbarBrand href="/" className='h1'>{parkName && window.location.pathname !== '/' ? parkName : 'The Park Mapper'}</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar >
            <Nav className="ml-auto" navbar>
              { isAuthenticated && !isLoading && <NavItem>
              <NavLink href='/ParkEditor' >{props.parkName === 'The Park Mapper' ? 'Add My Park' : 'Park Editor'}</NavLink>
              </NavItem>
              }
              <AddFeature setAddFeatureMode={props.setAddFeatureMode} addFeatureMode={props.addFeatureMode} newFeatureCoords={props.newFeatureCoordsApp} parkId={props.parkId} />
              { !isAuthenticated && !isLoading && <NavItem>
              <NavLink onClick={() => loginWithRedirect()} style={{
                cursor: 'pointer',
              }}>Login</NavLink>
              </NavItem>
              }
              <Settings newPark={newPark} />
            </Nav>
            
          </Collapse>
        </Navbar>
      </div>
    )
}
