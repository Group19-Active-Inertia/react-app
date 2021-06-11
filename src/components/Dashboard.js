import React, { useContext, useRef, useEffect, useState, useMemo } from 'react';
import './Dashboard.css';
import { AppContext } from '../appContextProvider';
import firebase, { auth, provider } from '../firebase.js';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import AddUser from './AddUser';
import UsersList from './UsersList';
import { enableRemoveOption, getDuration } from '../utils';
import ReachDOM from 'react-dom';
import { Line } from 'react-chartjs-2';

mapboxgl.accessToken = 'pk.eyJ1IjoicGczNzE4IiwiYSI6ImNrcDRkOTlweTAwMTYyb2xmOWdtYWQ5MHMifQ.qqgml2fS9n6aeHF3AOV64Q';

// var ref =  firebase.database().ref('items'); 
// var coord = [];

// ref.on('child_added', function(snap){
//     console.log(snap.val().Coordinate);
//     coord = snap.val().Coordinate;
//   });


const Dashboard = (props) => {
  const mapContainer = React.useRef();
  const { clearUser, user } = useContext(AppContext);
  const [reloadUsers, setReloadUsers] = useState(false);
  const [state, setState] = useState({
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
    nerus: [],
    events: [],
    arrivals: [],
    lng: -0.1278,
    lat: 51.5074,
    zoom: 4,
  });

  const handleChange = (e) => {
    setState((currState) => ({
      ...currState,
      [e.target.name]: e.target.value
    }));
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const itemsRef = firebase.database().ref('nerus');
    const item = {
      CurrentIP: state.CurrentIP,
      ID: state.ID,
      Latitude: state.Latitude,
      Longitude: state.Longitude,
      Name: state.Name,
      Online: state.Online,
      Port: state.Port
    }
    itemsRef.push(item);
    setState((currState) => ({
      ...currState,
      CurrentIP: '',
      ID: '',
      Latitude: '',
      Longitude: '',
      Name: '',
      Online: '',
      Port: ''
    }));
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    const eventsRef = firebase.database().ref('events');
    const event = {
      device_id_1: state.device_id_1,
      Latitude: state.Latitude,
      Longitude: state.Longitude,
      time: state.time,
      type: state.type
    }
    eventsRef.push(event);
    setState((currState) => ({
      ...currState,
      device_id_1: '',
      Latitude: '',
      Longitude: '',
      time: '',
      type: ''
    }));
  };
  // var ref_3 = firebase.database().ref('arrivals');
  // ref_3.on('child_added', function(snap) {
  //     const line_data = {
  //       labels: [snap.val().time],
  //       datasets: [
  //       {
  //         label: 'Duration',
  //         fill: false,
  //         lineTension: 0.5,
  //         backgroundColor: 'rgba(75,192,192,1)',
  //         borderColor: 'rgba(0,0,0,1)',
  //         borderWidth: 2,
  //         data: [snap.val().duration]
  //       }
  //       ]
  //     }
  // })

  console.log({ mapContainer });
  useEffect(() => {
    console.log('Component mounted');
    const itemsRef = firebase.database().ref('nerus');
    itemsRef.on('value', (snapshot) => {
      let nerus = snapshot.val();
      let newState = [];
      for (let item in nerus) {
        newState.push({
          ID: item,
          CurrentIP: nerus[item].CurrentIP,
          Latitude: nerus[item].Latitude,
          Longitude: nerus[item].Longitude,
          Name: nerus[item].Name,
          Online: nerus[item].Online,
          Port: nerus[item].Port
        });
      }
      setState((currState) => ({
        ...currState,
        nerus: newState
      }));
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
      setState((currState) => ({
        ...currState,
        events: newState
      }));
    });

    const arrivalsRef = firebase.database().ref('arrivals');
    arrivalsRef.on('value', (snapshot) => {
      let arrivals = snapshot.val();
      let newState = [];
      for (let arrival in arrivals) {
        newState.push({
          id: arrival,
          time: arrivals[arrival].time,
          duration: arrivals[arrival].duration
        });
      }
      setState((currState) => ({
        ...currState,
        arrivals: newState
      }));
    });




    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [state.lng, state.lat],
      zoom: state.zoom
    })
    var ref = firebase.database().ref('nerus');

    ref.on('child_added', function (snap) {
      var marker = new mapboxgl.Marker()
        .setLngLat([snap.val().Longitude, snap.val().Latitude])
        .setPopup(new mapboxgl.Popup({ offset: 30 })
          .setHTML('<h4>' + snap.val().Name + '<h4>' + 'CurrentIP:' + snap.val().CurrentIP + '<h4>' + 'Online:' + snap.val().Online))
        .addTo(map);
    })

    var ref_2 = firebase.database().ref('events');

    ref_2.on('child_added', function (snap) {
      var marker2 = new mapboxgl.Marker({ color: 'black' })
        .setLngLat([snap.val().Longitude, snap.val().Latitude])
        .setPopup(new mapboxgl.Popup({ offset: 30 })
          .setHTML('<h4>' + snap.val().device_id_1 + '<h4>' + 'Time:' + snap.val().time + '<h4>' + 'Type:' + snap.val().type))
        .addTo(map);
    })

  }, []);



  const removeItem = (itemId) => {
    const itemRef = firebase.database().ref(`/nerus/${itemId}`);
    itemRef.remove();
  }

  const removeEvent = (eventId) => {
    const eventsRef = firebase.database().ref(`/events/${eventId}`);
    eventsRef.remove();
  }

  const timeToDurationLineData = useMemo(() => {
    const labels = state.arrivals.map(arrival => arrival.time);
    const data = state.arrivals.map(getDuration);

    return {
      labels,
      datasets: [
        {
          label: 'Sending Time',
          fill: false,
          lineTension: 0.5,
          backgroundColor: 'rgba(75,192,192,1)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data
        }
      ]
    }
  },
    [state.arrivals]);

  return (
    <>
      <div className='app'>
        <header>
          <div className='wrapper'>
            <h1>Create Active Inertia</h1>
            <h2>{user.userType}</h2>
          </div>
          <div>
            <button onClick={() => clearUser()}>Log Out </button>
          </div>
        </header>
        <div className='container'>
          {
            user.userType !== 'default' &&
            <section className="add-item">
              <AddUser onSuccess={() => setReloadUsers(true)} nerus={state.nerus} />
              <p>Add a NERU</p>
              <form onSubmit={handleSubmit}>
                <input type="text" name="CurrentIP" placeholder="IP Address" onChange={handleChange} value={state.CurrentIP} />
                <input type="text" name="ID" placeholder="ID" onChange={handleChange} value={state.ID} />
                <input type="text" name="Latitude" placeholder="Lat" onChange={handleChange} value={state.Latitude} />
                <input type="text" name="Longitude" placeholder="Longitude" onChange={handleChange} value={state.Longitude} />
                <input type="text" name="Name" placeholder="Name" onChange={handleChange} value={state.Name} />
                <input type="text" name="Online" placeholder="Online" onChange={handleChange} value={state.Online} />
                <input type="text" name="Port" placeholder="Port" onChange={handleChange} value={state.Port} />
                <button>Add Neru</button>
              </form>
              <p>Simulate Inertia Event</p>
              <form onSubmit={handleSubmitEvent}>
                <input type="text" name="device_id_1" placeholder="Enter Device ID" onChange={handleChange} value={state.device_id_1} />
                <input type="text" name="Latitude" placeholder="Latitude" onChange={handleChange} value={state.Latitude} />
                <input type="text" name="Longitude" placeholder="Longitude" onChange={handleChange} value={state.Longitude} />
                <input type="text" name="time" placeholder="Time" onChange={handleChange} value={state.time} />
                <input type="text" name="type" placeholder="Event Type" onChange={handleChange} value={state.type} />
                <button>Generate Event</button>
              </form>

            </section>
          }
          <section className='display-item'>
            <h2>NERUs</h2>
            <div className="itemScroll">
              <ul className="horizScroll">
                {state.nerus.map((item) => {
                  return (
                    <li key={item.ID}>
                      <h3>{item.ID}</h3>
                      <p>IP Address: {item.CurrentIP}</p>
                      <p>Latitude: {item.Latitude}</p>
                      <p>Longitude: {item.Longitude}</p>
                      <p>Name: {item.Name}</p>
                      <p>Online: {item.Online}</p>
                      <p>Port: {item.Port}
                        {
                          enableRemoveOption(user, [item.Name]) &&
                          <button onClick={() => removeItem(item.ID)}>Remove NERU</button>
                        }
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
            <h2>Inertia Events</h2>
            <div className="itemScroll">
              <ul className="horizScroll">
                {state.events.map((event) => {
                  return (
                    <li key={event.id}>
                      <h3>{event.device_id_1}</h3>
                      <p>Device ID: {event.device_id_1}</p>
                      <p>Latitude: {event.Latitude}</p>
                      <p>Longitude: {event.Longitude}</p>
                      <p>Time: {event.time}</p>
                      <p>Type: {event.type}
                        {
                          user.userType === 'admin' &&
                          <button onClick={() => removeEvent(event.id)}>Archive</button>
                        }
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
            
            <UsersList reload={reloadUsers} onSuccessfulReload={() => setReloadUsers(false)} />
           
            

            
              <Line
                data={timeToDurationLineData}
                options={{
                  title: {
                    display: true,
                    text: 'Event Time v. Sending Time',
                    fontSize: 20
                  },
                  legend: {
                    display: true,
                    position: 'right'
                  }
                }}
              />
            

                {/* )
                })} */}

        </section>

          {/* {state.arrivals.map((arrival) => {
          return(
            <div>
            <Line
              data = {
              labels: [arrival.time],
              datasets: [
              {
              label: 'Duration',
              fill: false,
              lineTension: 0.5,
              backgroundColor: 'rgba(75,192,192,1)',
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 2,
              data: [arrival.duration]
              }
              ]
              }
          options={{
            title:{
              display:true,
              text:'Event Time v. Sending Time',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
          )
        })}
        /> */}

        </div>
        <div ref={mapContainer} style={{ width: '100%', height: '60vh' }} />

      </div>
    </>
  );
};

export default Dashboard;