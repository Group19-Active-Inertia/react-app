import React, { useState, useContext } from 'react';
import { AppContext } from '../appContextProvider';
import {loginApi, authEvents, authNerus} from '../api';
import PropTypes from 'prop-types';
import './Login.css';

//check user type
//if admin -> allow removal, adding of NERUs


const mapToUserDetails = (response) => {
  return {
    token: response.idToken,
    userType: response.userType,
    sites: response.sites,
  }
}
export default function Login(props) {
  const [email, setUserName] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const {saveUser} = useContext(AppContext);

  const login = async (e) => {
      e.preventDefault();
      try {
        const {data} = await loginApi(email, password);
        await authEvents(data.idToken);
        await authNerus(data.idToken);
        
        saveUser(mapToUserDetails(data));
        props.history.push('/dashboard');
      } catch(error) {
        console.log(error);
        setError(true);
        setError('Incorrect Login');
      }
      
  }
  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={login}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Log In</button>
        </div>
        <div>
        <p>
        {error}
        </p>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  history: PropTypes.object.isRequired
};
