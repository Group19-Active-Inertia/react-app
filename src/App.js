import React, { Component, useRef, useEffect, useState } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoicGczNzE4IiwiYSI6ImNrcDRkOTlweTAwMTYyb2xmOWdtYWQ5MHMifQ.qqgml2fS9n6aeHF3AOV64Q';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      events: [],
      user: '',
      lng: 3.4360,
      lat: 55.3781,
      zoom: 4
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); // <-- add this line
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
    this.mapContainer = React.createRef();
  }
  render() {
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
              <input type="text" name="device_id" placeholder="Enter Device ID" onChange={this.handleChange} value={this.state.device_id} />
              <input type="text" name="location" placeholder="Location" onChange={this.handleChange} value={this.state.location} />
              <input type="text" name="name" placeholder="Name" onChange={this.handleChange} value={this.state.name} />
              <input type="text" name="port" placeholder="Port" onChange={this.handleChange} value={this.state.port} />
              <button>Add Neru</button>
            </form>
            <p>Simulate Inertia Event</p>
            <form onSubmit={this.handleSubmitEvent}>
              <input type="text" name="device_id_1" placeholder="Enter Device ID" onChange={this.handleChange} value={this.state.device_id_1} />
              <input type="text" name="location_1" placeholder="Location" onChange={this.handleChange} value={this.state.location_1} />
              <input type="text" name="time" placeholder="Time" onChange={this.handleChange} value={this.state.time} />
              <input type="text" name="type" placeholder="Event Type" onChange={this.handleChange} value={this.state.type} />
              <button>Generate Event</button>
            </form>
        </section>
        <section className='display-item'>
          <div className="wrapper">
          <p>NERUs</p>
          <ul>
            {this.state.items.map((item) => {
              return (
                <li key={item.id}>
                  <h3>{item.name}</h3>
                  <p>Device ID: {item.device_id}</p>
                  <p>Location: {item.location}</p>
                  <p>Port: {item.port}
                  <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="wrapper">
        <p>Inertia Events</p>
          <ul>
            {this.state.events.map((event) => {
              return (
                <li key={event.id}>
                  <h3>Inertia Event: {event.location_1}</h3>
                  <p>Device ID: {event.device_id_1}</p>
                  <p>Location: {event.location_1}</p>
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
        <div ref={this.mapContainer} className="map-container" />
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
    device_id: this.state.device_id,
    location: this.state.location,
    name: this.state.name,
    port: this.state.port
  }
  itemsRef.push(item);
  this.setState({
    device_id: '',
    location: '',
    name: '',
    port: ''
  });
  }
  handleSubmitEvent(e) {
  e.preventDefault();
  const eventsRef = firebase.database().ref('events');
  const event = {
    device_id_1: this.state.device_id_1,
    location_1: this.state.location_1,
    time: this.state.time,
    type: this.state.type
  }
  eventsRef.push(event);
  this.setState({
    device_id_1: '',
    location_1: '',
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
        id: item,
        name: items[item].name,
        device_id: items[item].device_id,
        location: items[item].location,
        port: items[item].port,
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
        location_1: events[event].location_1,
        time: events[event].time,
        type: events[event].type
      });
    }
    this.setState({
      events: newState
    });
  });

  const { lng, lat, zoom } = this.state;
  const map = new mapboxgl.Map({
    container: this.mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: zoom
  });
}


removeItem(itemId) {
  const itemRef = firebase.database().ref(`/items/${itemId}`);
  itemRef.remove();
} 

removeEvent(eventId) {
  const eventsRef = firebase.database().ref(`/events/${eventId}`);
  eventsRef.remove();
} 

logout() {
  auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
}
login() {
  auth.signInWithPopup(provider) 
    .then((result) => {
      const user = result.user;
      this.setState({
        user
      });
    });
}


}
export default App;