import React, { useState, useEffect, useContext} from "react";
import ReactMapGL, { NavigationControl, Marker} from 'react-map-gl'

import { withStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import PinIcon from './PinIcon'
import Context from '../context'

const INITIAL_VIEWPORT ={
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
}

const Map = ({ classes }) => {
  const {state, dispatch} = useContext(Context)

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [userPosition, setuserPosition] = useState(null)

  useEffect(() => {
    getUserPositions()
  },[])

  const getUserPositions = () => {
    if('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        setViewport({ ...viewport, latitude, longitude})
        setuserPosition({latitude, longitude})
      })
    }
  }

  const handleMapClick = ({lngLat, leftButton }) => {
    if(!leftButton) return
    if(!state.draft){
      dispatch({ type:'CREATE_DRAFT'})
    }
    const [longitude, latitude ] = lngLat
    console.log(lngLat)
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude }
    })
  }

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height='calc(100vh - 64px)'
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxApiAccessToken='pk.eyJ1IjoibWFzYWhhNHUiLCJhIjoiY2p1anA4YzNuMGE0YzQzcXY0eXE0aHlndSJ9.sDEnmgaTNIblUrNCTgDu4A'
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl 
            onViewportChange={newViewport => setViewport(newViewport)}  
          />
        </div>

        {userPosition && (
         <Marker  
            latitude={userPosition.latitude} 
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
            >
            <PinIcon size={40} color='red' />
         </Marker>
        )}
        { state.draft && (
          <Marker  
          latitude={state.draft.latitude} 
          longitude={state.draft.longitude}
          offsetLeft={-19}
          offsetTop={-37}
          >
          <PinIcon size={40} color='hotpink' />
       </Marker>
        )}
      </ReactMapGL>
    </div>);
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
