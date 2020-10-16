import React, { useState, useEffect } from 'react';
import { Modal, NavItem, NavLink, Button } from 'reactstrap';
import ParkInfo from './ParkInfo';
import { useAuth0 } from '@auth0/auth0-react'

export default function Settings(props) {
    const [ modal, setModal ] = useState(false);
    const [ display, setDisplay ] = useState('Settings');
    const [ navbarData, setNavbarData ] = useState({});
    const { user, logout, isAuthenticated } = useAuth0();
    const { newPark } = props;

    const toggle = () => {
        setModal(!modal);
    }

    const getData = async () => {
        try {
            const response = await fetch(`/api/park/GetMyPark/${user.sub}`, {
                method: 'GET'
            })
            const responseData = await response.json();
            setNavbarData(responseData[0])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(user){
            getData()
        }
    }, [user])


    useEffect(() =>  {
        setNavbarData(newPark)
    }, [newPark])

    const updateNavbarData = (park) => {
        setNavbarData(park)
        if(park.location.lat !== navbarData.location.lat || park.location.lng !== navbarData.location.lng ){
            window.location.reload()
        }
    }

    return (
        <div>
            <NavItem>
                <NavLink onClick={toggle} style={{
                    cursor: 'pointer'
                }} >Menu</NavLink>
            </NavItem>
            <Modal isOpen={modal} toggle={toggle} className='text-center' >
            <Button size='sm' color='dark' className='position-absolute m-2' style={{fontSize: '1.15rem'}} onClick={() => {
                display === 'Settings' ? toggle() : setDisplay('Settings')
            }} >{display === 'Settings' ? 'x' : '↢' }</Button>
                <div className='flex-column w-100 p-3' style={{
                    display: display === 'Settings' ? 'flex' : 'none'
                }}>
                    <h3>Park Settings</h3>
                    {navbarData && <Button size='lg' color='dark' className='w-100 my-2' onClick={() => setDisplay('info')} >My Park</Button>}
                    {navbarData && <Button size='lg' color='dark' className='w-100 my-2' >Park Reservations</Button>}
                    {navbarData && <Button size='lg' color='dark' className='w-100 my-2' >Stripe Settings</Button>}
                    {navbarData && <Button size='lg' color='dark' className='w-100 my-2' >Park Reports</Button>}
                    <Button size='lg' color='dark' className='w-100 my-2'>My Reservations</Button>
                    {isAuthenticated && <Button size='lg' color='dark' className='w-100 my-2' onClick={() => logout()}>Logout</Button>}
                </div>
                {display === 'info' && <div 
                className='justify-content-center w-100'>
                    <ParkInfo navbarData={navbarData} updateNavbarData={updateNavbarData} />
                </div>}
                
            </Modal>
        </div>
    )
}
