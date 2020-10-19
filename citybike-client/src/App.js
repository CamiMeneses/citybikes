/* eslint-disable */

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
      this.setState({response: data});
      this.record();
    });
  }

  // Recording Data
  record = () => {
    if (this.state.response){
      var dataTime = this.state.dataTime

      var currentTimestamp = this.state.response.network.stations[0].timestamp
      var lastRegister = this.state.dataTime[this.state.dataTime.length-1]

      if (lastRegister){
        var lastTimestamp = lastRegister.network.stations[0].timestamp
        if ( currentTimestamp !=  lastTimestamp ){ // It will not record registers with same time
          dataTime.push(this.state.response)
        }
      }else{
        dataTime.push(this.state.response)
      }

      if (dataTime.length >= 1000){ //Maximum: 1000 registers
        dataTime.shift()
      }
    }
  }

  checkChanges(){
    if (this.state.response){
      var lastRegister = this.state.dataTime[this.state.dataTime.length-1]
      var currentData = this.state.response

      if(lastRegister){
        var data1stations = currentData.network.stations;
        var data2stations = lastRegister.network.stations;
        var differentFreebikes = []

        var freebikes1 = {}
        data1stations.forEach(station =>
          {
            freebikes1[station.name] = station.free_bikes
          }
        )

        var freebikes2 = {}
        data2stations.forEach(station =>
          {
            freebikes2[station.name] = station.free_bikes
          }
        )

        for (var name in freebikes1){
          if (freebikes1[name] == freebikes2[name]){
          }else{
            console.log(name)
            console.log(freebikes1[name])
            console.log(freebikes2[name])
            console.log("diferentes")
            differentFreebikes.push([name,freebikes1[name]])
          }
        }
      }
      console.log("checkUpdates:" + differentFreebikes);
      return differentFreebikes;
    }
  }

  // Selecting between live or historical data
  setStationsData = (numRegis) =>{
    var stations = "";

    if(this.state.response){
      if (this.state.sliderValue !== ""){ stations = this.getRecordStationsOnDate(numRegis) }
      if (!stations || ""){ stations = this.state.response.network.stations }

      return stations;
    }
  }

  getRecordStationsOnDate = (numRegis) => {
    console.log("value " + this.state.sliderValue)
    if (this.state.dataTime[this.state.sliderValue-1]){
      var choosenRegisValue = this.state.dataTime[this.state.sliderValue-1].network.stations
    }
    return choosenRegisValue;
  }

  // Showing stations
  showSpots = (icon, stationsData) => {
    if(this.state.response){
      var places = stationsData.map(
        (station, index) => { //station has theses keys: empty_slots, extra{address, uid}, free_bikes, id, latitude, longitude, name, timestamp
          return (
            <div key={`divspot_${station.extra.uid}`}>
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
        },
      );

      return places;
    }
  }

  handleOnChange = (e) => {
    this.setState({sliderValue: e.target.value})
  }

  sliderText = (stationsData) => {
    var sliderDate = ""

    if (stationsData){
      var StationsTimestamp = stationsData[0].timestamp
      var dateFormat = new Date(StationsTimestamp)
      sliderDate = dateFormat.getHours() + 'h' + dateFormat.getMinutes() + 'm' + dateFormat.getSeconds() + 's';
    }
    return sliderDate;
  }

  render() {
    var numRegis = this.state.dataTime.length;
    var stationsData = this.setStationsData(numRegis);
    var sliderText = this.sliderText(stationsData);
    var checkUpdates =  this.checkChanges();

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
          if (this.state.response){this.showSpots(icon, stationsData)}
        </Map>

        <div className= 'updates'>
          <h2>Last updates</h2>
          <p>{checkUpdates}</p>
        </div>

        <div className="register" id="register">
          <div className="numRegis" style={{color: "#00ffff"}}>
            <p>
              Número de registros: {numRegis} <br />
              Espera para ver el cambio en los registros. Actualizamos el registro cada 10 segundos, <br />
              sin embargo, City Bike no cambia en un promedio de 5 minutos.
            </p>
          </div>
        </div>
        <div>
          <input type="range" min={0} max={numRegis} value={this.state.sliderValue} className="slider" onChange={this.handleOnChange}/>
          <div className="value" style={{color: "#00ffff"}}>
            <p>
              <b>Registro número:</b> {this.state.sliderValue} <b>hora:</b> {sliderText}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
