import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';


class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      user: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); // <-- add this line
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
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
      <p>You must be logged in to see the potluck list and submit to it.</p>
    </div>
  }
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
}
removeItem(itemId) {
  const itemRef = firebase.database().ref(`/items/${itemId}`);
  itemRef.remove();
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