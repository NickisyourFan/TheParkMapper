import React, { useState } from 'react';
import { Button, Input } from 'reactstrap';

export default function ParkInfo(props) {
    const [ loading, setLoading ] = useState(false);
    const [ address, setAddress ] = useState(props.navbarData.address);
    const [ description, setDescription ] = useState(props.navbarData.description);
    const [ parkName, setParkName ] = useState(props.navbarData.parkName)
    const { updateNavbarData } = props;

    const saveInfo = async () => {
        setLoading(true)
        try {
            //Get Coords
            let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE}`, {
                method: 'POST',
            })
            const google = await response.json();
            let location = google.results[0].geometry.location


            //Save to DB
            response = await fetch(`/api/park/saveParkInfo/${props.navbarData._id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json; Charset=UTF-8"
                },
                body: JSON.stringify({
                    parkName: parkName,
                    address: address,
                    description: description,
                    location: location,
                })
            })
            const responseData = await response.json();
            if(responseData){
                setLoading(false)
                updateNavbarData(responseData)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='p-3 w-100'>
            <h3>Park Settings</h3>
            <hr/>
            <h5>Park Name</h5>
            <Input type='text' className='text-center' value={parkName} onChange={(e) => setParkName(e.target.value)} />
            <hr/>
            <h5>Park Address</h5>
            <Input type='text' className='text-center' value={address} onChange={(e) => setAddress(e.target.value)} />
            <hr/>
            <h5>Park Description</h5>
            <Input type='textarea' className='text-center' value={description} onChange={(e) => setDescription(e.target.value)} />
            <hr/>
            <Button disabled={loading} size='md' color='success' className='w-100' onClick={() => saveInfo()} >{loading ? 'Saving...' : 'Save'}</Button>
        </div>
    )
}
