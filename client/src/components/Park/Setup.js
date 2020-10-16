import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'reactstrap'
import { useAuth0 } from '@auth0/auth0-react'

export default function Setup(props) {
    const { setNewViewport, showSetup, updateParkName, enableMenu } = props;
    const [ modal, setModal ] = useState(false);
    const [ address, setAddress ] = useState('');
    const [ parkName, setParkName ] = useState('');
    const { user } = useAuth0();

    const toggle = () => {
        setModal(!modal);
    }

    useEffect(() => {
        if(showSetup){
            toggle();
        }
    }, [showSetup])

    const saveNewPark = async (location) => {
        try {
            const response = await fetch('/api/park/NewPark', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; Charset=UTF-8"
                },
                body: JSON.stringify({
                    userId: user.sub,
                    location: location,
                    address: address,
                    parkName: parkName,
                })
            })
            const resposneData = await response.json();
            updateParkName(parkName);
            enableMenu({
                userId: user.sub,
                location: location,
                address: address,
                parkName: parkName,
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getCoords = async () => {
        if(!address || !parkName){
            window.alert('Please enter a valid address and Park Name.')
        }else{
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE}`, {
                    method: 'POST',
                })
                const responseData = await response.json();
                let location = responseData.results[0].geometry.location
                setNewViewport(location)
                setModal(false)
                saveNewPark(location)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <Modal isOpen={modal} className='text-center'>
            <div className='p-3'>
                <h3>Let's Setup Your New Park Map!</h3>
                <p>The goal is simple - Let's create an interactive, easy to use, and good looking map that has the features your park needs!</p>
                <hr/>
                <h5>First, What is your park's address?</h5>
                <Input type='text' className='text-center' placeholder='23 Park Address BLVD, TX, 75056' onChange={(e) => setAddress(e.target.value)} />
                <hr/>
                <h5>Second, What is your park's name?</h5>
                <Input type='text' className='text-center' placeholder='The Coolest Park In Town' onChange={(e) => setParkName(e.target.value)} />
                <hr/>
                <h5>Third, Let's make it easy for you to collect fees!</h5>
                <p>This will let you sell admission to your park, annual passes, and take reservations for campsites/facilities. You set this up later if you choose!</p>
                <Button size='md' color='dark' className='w-100'>Setup Stripe</Button>
                <hr/>
                <Button size='md' color='success' className='w-100' onClick={getCoords}>Save and Continue</Button>
            </div>
        </Modal>
    )
}
