import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import './App.css'
import bikeIcon from './bicycle.png'

import L from 'leaflet'; // To use leaflet https://leafletjs.com/

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 25.761681, // Changing location to MIAMI
      lng: -80.191788,
      zoom: 13,
      dataTime: []
    };

  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('ApiData', data => { // Getting the data from the server
      this.setState({
        response: data,
      }); // Set the response
    });
  }

  spots = () => {
    var icon = L.icon({
      iconUrl: bikeIcon,
      iconSize: [30, 30]
    });
    if (this.state.response){
      var dataTime = this.state.dataTime
      dataTime.push(this.state.response)
      console.log(dataTime);
      console.log(dataTime.length)
      if (dataTime.length >= 10){
        console.log(dataTime.length)
        dataTime.shift()
      }
    }

    const miamiBikes = this.state;
    console.log("hellloooo");

    if(miamiBikes.response){
    const stationsData = miamiBikes.response.network.stations // searching JSON network > stations

    var places = stationsData.map(
      (station, index) => { //station has theses keys: empty_slots, extra{address, uid}, free_bikes, id, latitude, longitude, name, timestamp
        return (
          <div>
            <Marker position={[station.latitude, station.longitude]} icon={icon}>
              <Popup>
                <div className="address">
                  {station.extra.address}
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
      },
    );
    return places;
  }
  }

  render() {
    const miamiBikes = this.state;

    return (
      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={[miamiBikes.lat, miamiBikes.lng]} zoom={miamiBikes.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          if(miamiBikes.response){
            this.spots()
          }
        </Map>
      </div>
    );
  }
}
export default App;
