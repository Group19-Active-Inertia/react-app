import React, { Component, useRef, useEffect, useState } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReachDOM from 'react-dom';

mapboxgl.accessToken='pk.eyJ1IjoicGczNzE4IiwiYSI6ImNrcDRkOTlweTAwMTYyb2xmOWdtYWQ5MHMifQ.qqgml2fS9n6aeHF3AOV64Q';

// var ref =  firebase.database().ref('items'); 
// var coord = [];

// ref.on('child_added', function(snap){
//     console.log(snap.val().Coordinate);
//     coord = snap.val().Coordinate;
//   });


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentIP: '',
      ID: '',
      Latitude: '',
      Longitude: '',
      Name: '',
      Online: '',
      Port: '',
      device_id_1: '',
      time: '',
      type: '',
      items: [],
      events: [],
      user: '',
      lng: -0.1278,
      lat: 51.5074,
      zoom: 4
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitEvent = this.handleSubmitEvent.bind(this); // <-- add this line
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
    this.mapContainer = React.createRef();
  }
  render(){

    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Create Active Inertia</h1>
                {this.state.user ?
                <button onClick={this.logout}>Log Out</button>                
                :
                 <button onClick={this.login}>Log In</button>              
                 }
            </div>
        </header>
        {this.state.user ?
    <div>
      <div className='user-profile'>
        <img src={this.state.user.photoURL} />
      </div>
    </div>
    :
    <div className='wrapper'>
      <p>You must be logged in to see the NERU list</p>
    </div>
  }
        <div className='container'>
          <section className="add-item">
          <p>Add a NERU</p>
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="CurrentIP" placeholder="IP Address" onChange={this.handleChange} value={this.state.CurrentIP} />
              <input type="text" name="ID" placeholder="ID" onChange={this.handleChange} value={this.state.ID} />
              <input type="text" name="Latitude" placeholder="Lat" onChange={this.handleChange} value={this.state.Latitude} />
              <input type="text" name="Longitude" placeholder="Longitude" onChange={this.handleChange} value={this.state.Longitude} />
              <input type="text" name="Name" placeholder="Name" onChange={this.handleChange} value={this.state.Name} />
              <input type="text" name="Online" placeholder="Online" onChange={this.handleChange} value={this.state.Online} />
              <input type="text" name="Port" placeholder="Port" onChange={this.handleChange} value={this.state.Port} />
              <button>Add Neru</button>
            </form>
            <p>Simulate Inertia Event</p>
            <form onSubmit={this.handleSubmitEvent}>
              <input type="text" name="device_id_1" placeholder="Enter Device ID" onChange={this.handleChange} value={this.state.device_id_1} />
              <input type="text" name="Latitude" placeholder="Latitude" onChange={this.handleChange} value={this.state.Latitude} />
              <input type="text" name="Longitude" placeholder="Longitude" onChange={this.handleChange} value={this.state.Longitude} />
              <input type="text" name="time" placeholder="Time" onChange={this.handleChange} value={this.state.time} />
              <input type="text" name="type" placeholder="Event Type" onChange={this.handleChange} value={this.state.type} />
              <button>Generate Event</button>
            </form>
        </section>
        <section className='display-item'>
          <div className="wrapper">
          <h2>NERUs</h2>
          <ul>
            {this.state.items.map((item) => {
              return (
                <li key={item.ID}>
                <h3>ID: {item.ID}</h3>
                  <p>IP Address: {item.CurrentIP}</p>
                  <p>Latitude: {item.Latitude}</p>
                  <p>Longitude: {item.Longitude}</p>
                  <p>Name: {item.Name}</p>
                     <p>Online: {item.Online}</p>
                   <p>Port: {item.Port}
                   <button onClick={() => this.removeItem(item.ID)}>Remove NERU</button>
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="wrapper">
        <h2>Inertia Events</h2>
          <ul>
            {this.state.events.map((event) => {
              return (
                <li key={event.id}>
                  <h3>Inertia Event: {event.location_1}</h3>
                  <p>Device ID: {event.device_id_1}</p>
                  <p>Latitude: {event.Latitude}</p>
                  <p>Longitude: {event.Longitude}</p>
                  <p>Time: {event.time}</p>
                   <p>Type: {event.type}
                   <button onClick={() => this.removeEvent(event.id)}>Archive</button>
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
        </section>
      </div>
        <div ref={el => this.mapContainer = el} style={{width:'100%', height:'60vh'}}/>
         </div>
    );
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
     });
  }
  handleSubmit(e) {
  e.preventDefault();
  const itemsRef = firebase.database().ref('items');
  const item = {
    CurrentIP: this.state.CurrentIP,
    ID: this.state.ID,
    Latitude: this.state.Latitude,
    Longitude: this.state.Longitude,
    Name: this.state.Name,
    Online: this.state.Online,
    Port: this.state.Port
  }
  itemsRef.push(item);
  this.setState({
    CurrentIP: '',
    ID: '',
    Latitude: '',
    Longitude: '',
    Name: '',
    Online: '',
    Port: ''
  });
  }
  handleSubmitEvent(e) {
  e.preventDefault();
  const eventsRef = firebase.database().ref('events');
  const event = {
    device_id_1: this.state.device_id_1,
    Latitude: this.state.Latitude,
    Longitude: this.state.Longitude,
    time: this.state.time,
    type: this.state.type
  }
  eventsRef.push(event);
  this.setState({
    device_id_1: '',
    Latitude: '',
    Longitude: '',
    time: '',
    type: ''
  });
  }
  componentDidMount() {
   auth.onAuthStateChanged((user) => {
    if (user) {
      this.setState({ user });
    } 
    }); 
  const itemsRef = firebase.database().ref('items');
  itemsRef.on('value', (snapshot) => {
    let items = snapshot.val();
    let newState = [];
    for (let item in items) {
      newState.push({
        ID: item,
        CurrentIP: items[item].CurrentIP,
        Latitude: items[item].Latitude,
        Longitude: items[item].Longitude,
        Name: items[item].Name,
        Online: items[item].Online,
        Port: items[item].Port
      });
    }
    this.setState({
      items: newState
    });
  });

    const eventsRef = firebase.database().ref('events');
  eventsRef.on('value', (snapshot) => {
    let events = snapshot.val();
    let newState = [];
    for (let event in events) {
      newState.push({
        id: event,
        device_id_1: events[event].device_id_1,
        Latitude: events[event].Latitude,
        Longitude: events[event].Longitude,
        time: events[event].time,
        type: events[event].type
      });
    }
    this.setState({
      events: newState
    });
  });

  const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11', 
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    })
    var ref = firebase.database().ref('items');
    
      ref.on('child_added', function(snap){        
        var marker = new mapboxgl.Marker()
              .setLngLat([snap.val().Longitude, snap.val().Latitude])
              .setPopup(new mapboxgl.Popup({ offset: 30 })
              .setHTML('<h4>' + snap.val().Name + '<h4>' + 'CurrentIP:' + snap.val().CurrentIP + '<h4>' + 'Online:' + snap.val().Online))
              .addTo(map);
    })

    var ref_2 = firebase.database().ref('events');
    
      ref_2.on('child_added', function(snap){        
        var marker2 = new mapboxgl.Marker({color: 'black'})
              .setLngLat([snap.val().Longitude, snap.val().Latitude])
              .setPopup(new mapboxgl.Popup({ offset: 30 })
              .setHTML('<h4>' + snap.val().device_id_1 + '<h4>' + 'Time:' + snap.val().time + '<h4>' + 'Type:' + snap.val().type))
              .addTo(map);
    })

}


removeItem(itemId) {
  const itemRef = firebase.database().ref(`/items/${itemId}`);
  itemRef.remove();
  window.location.reload(false);
} 

removeEvent(eventId) {
  const eventsRef = firebase.database().ref(`/events/${eventId}`);
  eventsRef.remove();
  window.location.reload(false);
} 

login() {
  auth.signInWithPopup(provider) 
    .then((result) => {
      const user = result.user;
      this.setState({
        user
      });
      window.location.reload(false);
    });
}

logout() {
  auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
      window.location.reload(false);
    });
}





}
export default App;