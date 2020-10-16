import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import Setup from './Setup';
import { useAuth0 } from '@auth0/auth0-react'
import ParkInfo from './Settings/ParkInfo';
import { Button } from 'reactstrap'

let shouldSavePark = 0;

export default function Park(props) {
    const { updateParkName, enableMenu, addFeatureMode, setNewFeatureCoordsApp } = props;
    const { user, loading } = useAuth0();
    const [ showSetup, setShowSetup ] = useState(false)
    const [ parkData, setParkData ] = useState()
    const [ selectedFeature, setSelectedFeature ] = useState()
    const [ newFeatureCoords, setNewFeatureCoords ] = useState();
    const [ parkFeatures, setParkFeatures ] = useState([]);
    const [ viewport, setViewport ] = useState({
            width: '100vw',
            height: '100vh',
            latitude: 37.7577,
            longitude: -122.4376,
            zoom: 8
    })

    const getParkData = async () => {
        try {
            const response = await fetch(`/api/park/GetMyPark/${user.sub}`, {
                method: 'GET'
            })
            const responseData = await response.json();
            if(responseData.length === 0){
                setShowSetup(true)
            }else{
                setParkData(responseData[0])
                setViewport({
                    ...viewport,
                    latitude: responseData[0].location.lat,
                    longitude: responseData[0].location.lng,
                    zoom: 15
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getParkFeatures = async () => {
        try {
            const response = await fetch(`/api/park/GetParkFeatures/${parkData._id}`, {
                method: 'GET',
            });
            const responseData = await response.json()
            setParkFeatures(responseData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(parkData){
            getParkFeatures()
        }
    }, [parkData])

    useEffect(() => {
        if(user){
            getParkData()
        }
    }, [user])

    useEffect(() => {
        if(newFeatureCoords){
            setNewFeatureCoordsApp(newFeatureCoords)
        }
    }, [newFeatureCoords])

    const setNewViewport = (location) => {
        setViewport({
            width: '100vw',
            height: '100vh',
            latitude: location.lat,
            longitude: location.lng,
            zoom: 15,
        })
        setParkData({
            ...parkData,
            location
        })
    }

    if(!user || loading || !parkData){
        return <div className='d-flex justify-content-center align-items-center' style={{
            height: '100vh',
            width: '100vw',
        }}>Loading Your Awesome Park...</div>
    }

    return (
        <div>
            <ReactMapGL
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
                {...viewport}
                onViewportChange={(viewport) => setViewport(viewport)}
                getCursor={() => {
                    return addFeatureMode ? 'crosshair' : 'grab'
                }}
                onClick={(e) => {
                    if(addFeatureMode){
                        setNewFeatureCoords(e.lngLat)
                    }
                    
                }}
            >
                <Marker 
                latitude={parkData.location.lat} 
                longitude={parkData.location.lng}
                offsetLeft={-20}
                offsetTop={-17.5}
                >
                    <button 
                    onClick={() => {
                        if(selectedFeature !== 'Park'){
                            setSelectedFeature('Park')
                        }else {
                            setSelectedFeature(null)
                        }
                    }}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        outline: "none"
                    }}>
                        <img src={'/Icons/ParkIcon.svg'} alt="Park Icon" style={{
                        width: "35px", 
                        height: "35px",
                        zIndex: "1"
                        }}/>
                    </button>
                </Marker>
                {selectedFeature === 'Park' && (
                    <Popup 
                        latitude={parkData.location.lat} 
                        longitude={parkData.location.lng}
                        closeOnClick={false}
                        onClose={() => {
                            setSelectedFeature(null)
                        }}
                        offsetLeft={4}
                        offsetTop={-20}
                        sortByDepth={true}
                        >
                            <div className="d-flex flex-column" style={{
                                width: '250px'
                            }}>
                                <h6 className="p-2" style={{
                                }}>{parkData.parkName}</h6>
                                <p className='p-2'>
                                    {parkData.description}
                                </p>
                            </div>
                    </Popup>
                )}
                {parkFeatures && parkFeatures.map(feature => {
                    return <Marker
                    key={feature._id}
                    latitude={feature.featureLocation[1]}
                    longitude={feature.featureLocation[0]}
                    offsetLeft={-20}
                    offsetTop={-17.5}

                    >
                        <button 
                        onClick={() => {
                            if(selectedFeature !== feature._id){
                                setSelectedFeature(feature._id)
                            }else {
                                setSelectedFeature(null)
                            }
                        }}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            outline: "none"
                        }}>
                            <img src={`/Icons/${feature.featureType.split(' ').join('')}.svg`} alt="Park Icon" style={{
                            width: "35px", 
                            height: "35px",
                            zIndex: "1"
                            }}/>
                        </button>
                    </Marker>
                })}
                {selectedFeature && selectedFeature !== 'Park' && parkFeatures.map(feature => {
                    if(selectedFeature === feature._id){
                        return <Popup 
                        key={`${feature._id}-${feature.featureName}`}
                        latitude={feature.featureLocation[1]} 
                        longitude={feature.featureLocation[0]}
                        closeOnClick={false}
                        onClose={() => {
                            setSelectedFeature(null)
                        }}
                        offsetLeft={4}
                        offsetTop={-20}
                        sortByDepth={true}
                        >
                            <div className="d-flex flex-column" style={{
                            width: "250px"
                            }}>
                                <small className='px-2 mb-0'>{feature.featureType}</small>
                                <h5 className="p-2 mb-0" >{feature.featureName}</h5>
                                <div className='p-2 rounded text-light' style={{
                                    backgroundColor: 'grey'
                                }}>
                                    <p className='p-2'>{feature.featureDescription}</p>
                                </div>
                                <div className='d-flex flex-row justify-content-around my-2'>
                                    <Button size='sm' color='primary' className='w-100 mr-1'>Edit</Button>
                                    <Button size='sm' color='danger' className='w-100 ml-1'>Delete</Button>
                                </div>
                            </div>
                        </Popup>
                    }
                })}
            </ReactMapGL>
            {addFeatureMode && <div className='alert-warning w-100' style={{
                position: 'absolute',
                bottom: 0,
            }}>
                <h4>Single Click to Select Your Feature Location!</h4>
            </div>}
            <Setup showSetup={showSetup} setNewViewport={setNewViewport} updateParkName={updateParkName} enableMenu={enableMenu} />
        </div>
    )
}
