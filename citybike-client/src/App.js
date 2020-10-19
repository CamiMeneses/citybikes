import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import './App.css'
import bikeIcon from './bicycle.png';

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
      dataTime: [], // Records
      sliderValue: ""
    };
  }

  // Getting data
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('ApiData', data => {
      this.setState({
        response: data,
      });
    });
  }

  // Record Data
  record = () => {
    if (this.state.response){
      var dataTime = this.state.dataTime
      dataTime.push(this.state.response)

      if (dataTime.length >= 1000){ //Maximum: 1000 registers
        dataTime.shift()
      }
    }
  }

  setStationsData = (numRegis) =>{
    var stations = ""
    if(this.state.response){
      console.log("sliderValue:" + this.state.sliderValue)
      if (this.state.sliderValue === ""){
        stations = this.state.response.network.stations // searching JSON network > stations
      }else{
        stations = this.getRecordStationsOnDate(numRegis) // Getting historical spots to show
      }

      return stations;
    }
  }

  getRecordStationsOnDate = (numRegis) => {
    console.log("value " + this.state.sliderValue)
    if (this.state.dataTime[this.state.sliderValue]){
      var choosenRegisValue = this.state.dataTime[this.state.sliderValue].network.stations
    }
    return choosenRegisValue;
  }

  // Showing stations
  showSpots = (icon, stationsData) => {
    if(this.state.response){
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

  handleOnChange = (e) => {
    this.setState({sliderValue: e.target.value})
    console.log("value: " + e.target.value);
  }

  sliderText = (stationsData) => {
    var sliderDate = ""

    if (stationsData){
      var StationsTimestamp = stationsData[0].timestamp
      var dateFormat = new Date(StationsTimestamp)
      sliderDate = 'hora del registro:' + dateFormat.getHours() + ':' + dateFormat.getMinutes() + ':' + dateFormat.getSeconds();
    }
    console.log("sliderDate:" + sliderDate);
    return sliderDate;
  }

  render() {
    var numRegis = this.state.dataTime.length;
    var stationsData = this.setStationsData(numRegis);
    var sliderText = this.sliderText(stationsData);

    var icon = L.icon({
      iconUrl: bikeIcon,
      iconSize: [30, 30]
    });

    return (
      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={[this.state.lat, this.state.lng]} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          if (this.state.response){[this.showSpots(icon, stationsData), this.record()]}
        </Map>
        <div className="register" id="register">
        <div className="numRegis" style={{color: "#00ffff"}}>
          Número de registros: {numRegis} <br />
          Espera para ver el cambio en los registros. Actualizamos el registro cada 10 segundos, <br />
          sin embargo, City Bike no cambia en un promedio de 5 minutos.
        </div>
        </div>
        <div >
          <input type="range" min={0} max={numRegis} value={this.state.sliderValue} className="slider" onChange={this.handleOnChange}/>
          <div className="value" style={{color: "#00ffff"}}>{sliderText}</div>
        </div>
      </div>
    );
  }
}

export default App;
