/* eslint-disable */

import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer} from "react-leaflet";
import './App.css'
import './firebase/firebase';
import {db} from './firebase/firebase'

import ShowSpots from "./components/ShowSpots";

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
      sliderValue: "",
      differentFreebikes: []
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

  // Recording Data Firebase
  recordFirebase = async() => {
    await db.collection('records').doc().set(this.state.response)
    console.log('new record added')
  }

  // Getting info from firebase
  fillDataTime = async() => {
    const querySnapshot = await db.collection('records').get();
    if (this.state.dataTime.length < 1){
      querySnapshot.forEach(doc => { // Bringing each record
        this.state.dataTime.push(doc.data()); //filling dataTime with the Data Base
        //Modifying dataTime to see changes easier
        let n = 0;
        let randDatatime = this.state.dataTime.length;
        while (n < 5) {
         this.state.dataTime[randDatatime-1].network.stations[Math.floor(Math.random() * 146)].free_bikes = Math.floor(Math.random() * 15)
          n ++;
        }
      })
    }
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
          dataTime.push(this.state.response);
          this.recordFirebase();
        }
      }else{
        this.recordFirebase();
        this.fillDataTime();
      }
    }
  }

  // Checking for updates
  checkChanges(){
    if (this.state.response){
      var lastRegister = this.state.dataTime[this.state.dataTime.length-1]
      var currentData = this.state.response

      //only compares the last resgister and the new one

      if(lastRegister){
        var data1stations = currentData.network.stations;
        var data2stations = lastRegister.network.stations;
        var freebikes1 = {}
        var freebikes2 = {}

        data1stations.forEach(station => freebikes1[station.name] = station.free_bikes)
        data2stations.forEach(station => freebikes2[station.name] = station.free_bikes)

        for (var name in freebikes1){
          if (freebikes1[name] == freebikes2[name]){
          }else{
            if(freebikes2[name]>=0 && freebikes1[name]>=0){
              this.state.differentFreebikes.push([name, freebikes2[name], freebikes1[name]])
            }
          }
        }
      }
      return this.state.differentFreebikes;
    }
  }

  // Selecting between live or historical data for the slider
  setStationsData = (numRegis) =>{
    var stations = "";

    if(this.state.response){
      if (this.state.sliderValue !== ""){ stations = this.getRecordStationsOnDate(numRegis) }
      if (!stations || this.state.sliderValue == ""){ stations = this.state.response.network.stations }

      return stations;
    }
  }

  getRecordStationsOnDate = (numRegis) => {
    if (this.state.dataTime[this.state.sliderValue-1]){
      var choosenRegisValue = this.state.dataTime[this.state.sliderValue-1].network.stations
    }
    return choosenRegisValue;
  }

  handleOnChange = (e) => {
    this.setState({sliderValue: e.target.value})
  }

  sliderText = (stationsData) => {
    var sliderDate = ""

    if (stationsData){
      var StationsTimestamp = stationsData[0].timestamp
      var dateFormat = new Date(StationsTimestamp)
      sliderDate = (dateFormat.getDate() + '/' + dateFormat.getMonth() + '   -   '+
                    dateFormat.getHours() + 'h' + dateFormat.getMinutes() + 'm' + dateFormat.getSeconds() + 's');
      ;
    }
    return sliderDate;
  }

  render() {
    var numRegis = this.state.dataTime.length;
    var stationsData = this.setStationsData(numRegis);
    var sliderText = this.sliderText(stationsData);
    var checkUpdates;
    if (this.checkChanges()){
      checkUpdates = this.checkChanges().map((update, index) => {
                      return (
                          <tr key={index}>
                            <td>{update[0]}</td>
                            <td>{update[1]}</td>
                            <td>{update[2]}</td>
                          </tr>
                      );
                    })
    }else{
      checkUpdates = <div />;
    }

    return (
      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={[this.state.lat, this.state.lng]} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ShowSpots stationsData={stationsData}/>
        </Map>
        <div className="register" id="register">
          <div className="numRegis">
            <p>
              Número de registros: {numRegis} <br />
              El registro se actualiza cada 5 segundos, sin embargo, City Bike no cambia en un promedio de 5 minutos.
              Ya que no se registran grandes cambios se realizaron algunas modificaciones aleatorias para que los cambios fueran un poco mas significativos.
              <br />
              Base de datos usada: <b>Firebase</b>.
            </p>
          </div>
        </div>
        <div>
          <input type="range" min={0} max={numRegis} value={this.state.sliderValue} className="slider" onChange={this.handleOnChange}/>
          <div className="value" style={{color: "#00ffff"}}>
            <p>
              <b>Registro número:</b> {this.state.sliderValue} <b>Fecha:</b> {sliderText}
            </p>
          </div>
        </div>
        <div className= 'updates'>
          <h2>Last updates </h2>
          {checkUpdates}
        </div>
      </div>
    );
  }
}

export default App;
