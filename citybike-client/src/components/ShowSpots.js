import React, { Component } from "react";
import greenBikeIcon from '../assets/greenBike.png';
import orangeBikeIcon from '../assets/orangeBike.png';
import pinkBikeIcon from '../assets/pinkBike.png';
import duskBikeIcon from '../assets/duskBike.png';
import { Marker, Popup } from "react-leaflet";

import L from 'leaflet'; // To use leaflet https://leafletjs.com/

const showSpots = (props) => {
    var colorIcon = ""
    var sizeIcon  = []

    if(props.stationsData){
      var places = props.stationsData.map(
        (station, index) => { //station has theses keys: empty_slots, extra{address, uid}, free_bikes, id, latitude, longitude, name, timestamp
          if (station.free_bikes >= 10){
            colorIcon = greenBikeIcon;
            sizeIcon = [43, 43];
          }else if(station.free_bikes >= 5 && station.free_bikes < 10){
            colorIcon = orangeBikeIcon;
            sizeIcon = [37, 37];
          }else if(station.free_bikes >= 1 && station.free_bikes < 5){
            colorIcon = pinkBikeIcon;
            sizeIcon = [34, 34];
          }else{
            colorIcon = duskBikeIcon;
            sizeIcon = [30, 30];
          }

          var icon = L.icon({
            iconUrl: colorIcon,
            iconSize: sizeIcon
          });
          return (
            <div key={`div_spot_${station.extra.uid}`}>
              <Marker key={`marker_${station.extra.uid}`} position={[station.latitude, station.longitude]} icon={icon}>
                <Popup>
                  <div className="name">
                    {station.name}
                  </div>
                  <div className="description">
                    <hr />
                    <b>Free bikes:</b> {station.free_bikes}
                    <br />
                    <b>Empty slots:</b> {station.empty_slots}
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        }
      );
      return places;
    }else{
      return <></>
    }
}

export default showSpots
