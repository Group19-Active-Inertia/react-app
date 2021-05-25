import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js'; // <--- add this line


class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); // <-- add this line
  }
  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Create Active Inertia</h1>
            </div>
        </header>
        <div className='container'>
          <section className="add-item">
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="device_id" placeholder="Enter Device ID" onChange={this.handleChange} value={this.state.device_id} />
              <input type="text" name="location" placeholder="Location" onChange={this.handleChange} value={this.state.location} />
              <input type="text" name="name" placeholder="Name" onChange={this.handleChange} value={this.state.name} />
              <input type="text" name="port" placeholder="Port" onChange={this.handleChange} value={this.state.port} />
              <button>Add Neru</button>
            </form>
        </section>
        <section className='display-item'>
          <div className="wrapper">
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
        </section>
        </div>
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
  componentDidMount() {
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
}
removeItem(itemId) {
  const itemRef = firebase.database().ref(`/items/${itemId}`);
  itemRef.remove();
} 
}
export default App;