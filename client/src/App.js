import React, { useState, useEffect } from 'react';
import { Router, Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"
import NavbarA from './components/nav/NavBarA';
import HomePage from './components/HomePage';
import Park from './components/Park/Park';
import history from './utils/history';
import './App.css';

function App() {
  const { user } = useAuth0();
  const [ parkName, setParkName ] = useState('The Park Mapper')
  const [ newPark, setNewPark ] = useState()
  const [ addFeatureMode, setAddFeatureMode ] = useState(false);
  const [ newFeatureCoordsApp, setNewFeatureCoordsApp ] = useState()
  const [ parkId, setParkId ] = useState('')

  const getParkName = async () => {
    try {
      const response = await fetch(`/api/park/GetParkName/${user.sub}`, {
        method: 'GET'
      })
      const responseData = await response.json();
      setParkName(responseData.parkName)
      setParkId(responseData.parkId)
    } catch (error) {
      console.log(error)
    }
  }

  const updateParkName = (name) => {
    setParkName(name)
  }

  useEffect(() => {
    if(user){
      getParkName();
    }
  }, [user])

  const enableMenu = (nPark) => {
    setNewPark(nPark)
  }

  return (
    <div className="App" style={{
      position: 'relative'
    }}>
      <Router history={history} >
        <NavbarA parkName={parkName} newPark={newPark} setAddFeatureMode={setAddFeatureMode} addFeatureMode={addFeatureMode} newFeatureCoordsApp={newFeatureCoordsApp} parkId={parkId} />
        <Switch>
          <Route path='/' exact component={HomePage} />
          {/* <Route path='/ParkEditor' exact component={Park} /> */}
          <Route path='/ParkEditor' render={props => (
            <Park updateParkName={updateParkName} enableMenu={enableMenu} addFeatureMode={addFeatureMode} setNewFeatureCoordsApp={setNewFeatureCoordsApp} />
          )} />
        </Switch>
      </Router>
    </div>
  );
}

//1234

export default App;
