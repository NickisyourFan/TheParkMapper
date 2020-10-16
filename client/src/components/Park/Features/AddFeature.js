import React, { useState, useEffect } from 'react'
import { Input, Modal, NavItem, NavLink, Label, Button } from 'reactstrap';
import Features from './FeatureList';


export default function AddFeature(props) {
    const [ modal, setModal ] = useState(false)
    const { setAddFeatureMode, newFeatureCoords, parkId, addFeatureMode } = props;
    const [ reservationMode, setReservationMode ] = useState(false);
    const [ featureName, setFeatureName ] = useState('');
    const [ featureType, setFeatureType ] = useState('');
    const [ featureDescription, setFeatureDescription ] = useState('');
    const [ resDetails, setResDetails ] = useState({reservationPrice: 0})
    const [ featureLocation, setFeatureLocation ] = useState([])

    useEffect(() => {
        let allowedReservations = ['Tent Site', 'RV Site', 'Cabin', 'Pavilion', 'Picnic Area']
        if(allowedReservations.includes(featureType)){
            setReservationMode(true)
        }else {
            setReservationMode(false)
        }
    }, [featureType])

    const toggle = () => {
        setModal(!modal)
    }

    const newFeature = () => {
        if(!addFeatureMode){
            setAddFeatureMode(true)
        }else{
            setAddFeatureMode(false)
        }
    }

    useEffect(() => {
        if(newFeatureCoords){
            toggle();
            setAddFeatureMode(false)
            setFeatureLocation(newFeatureCoords)
        }
    }, [newFeatureCoords])

    const saveFeature = async () => {
        if(featureName && featureType && featureDescription){
            if(reservationMode && resDetails.allowRservations && (!resDetails.reservationPrice || resDetails.reservationPrice === '0' || parseInt(resDetails.reservationPrice) < 0)){
                window.alert('Please include a valid price/day for your reservation.')
            }else{
                let newFeature = {
                    featureName: featureName,
                    featureType: featureType,
                    featureDescription: featureDescription,
                    resDetails: reservationMode ? resDetails : {}, 
                    featureLocation: featureLocation,
                    parkId: parkId,
                }
                try {
                    const response = await fetch('/api/park/NewFeature', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json; Charset=UTF-8",
                        },
                        body: JSON.stringify(newFeature)
                    })
                    const responseData = await response.json()
                    if(responseData){
                        window.location.reload()
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }else {
            window.alert('Please make sure to fill in the Feature Type, Name, and Description.')
        }
    }

    return (
        <div>
            <NavItem>
            <NavLink onClick={newFeature} style={{cursor: 'pointer'}} >{!addFeatureMode ? ' Add Feature' : 'Cancel'}</NavLink>
            </NavItem>
            <Modal isOpen={modal} toggle={toggle} className='text-center' >
                <div className='flex-column w-100 p-3'>
                    <h3>New Park Feature</h3>
                    <hr/>
                    <h5>1. Select Feature Type</h5>
                    <Input type='select' className='w-100' onChange={(e) => {
                        setFeatureType(e.target.value)
                    }} >
                        <option>Select Type</option>
                        {Features.sort().map(f => {
                            return <option key={f.featureName} value={f.featureName} >{f.featureName}</option>
                        })}
                    </Input>
                    <hr/>
                    <h5>2. Feature Name</h5>
                    <Input type='text' className='w-100' onChange={(e) => {
                        setFeatureName(e.target.value)
                    }}/>
                    <hr/>
                    <h5>3. Feature Description</h5>
                    <Input type='textarea' className='w-100' onChange={(e) => {
                        setFeatureDescription(e.target.value)
                    }}/>
                    <hr/>
                    {reservationMode && <div><h5>4. Reservation Details</h5>
                    <div className='my-3'>
                        <Input type='checkbox' onChange={(e) => setResDetails({...resDetails, allowRservations: e.target.checked})}/>
                        <Label>Enable Reservations</Label>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <Label className='w-75 mb-0 align-self-center'>Charge Per Day:</Label>
                        <div className='d-flex flex-row justify-content-center align-items-center w-100'>
                            <h4 className='mb-0'>$</h4>
                            <Input type='number' value={resDetails.reservationPrice} onChange={(e) => {
                                setResDetails({...resDetails, reservationPrice: e.target.value})
                            }}/>
                        </div>
                    </div>
                    <hr/> 
                    </div>}
                    <Button size='md' color='dark' className='w-100' onClick={saveFeature}>Create Feature</Button>
                </div>
            </Modal>
        </div>
    )
}
