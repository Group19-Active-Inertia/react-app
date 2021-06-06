import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';

//check user type
//if admin -> allow removal, adding of NERUs

async function loginUser(credentials) {
 const response = await fetch('http://neru-api.herokuapp.com/weblogin', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 });
 console.log({response});
 return response;
}

export default function Login({ setToken}) {
  const [email, setUserName] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    try{
      const token = await loginUser({
        email,
        password
      });
      console.log(token);
      if(token.ok){
        setToken(token);
      }
      else{
        setError('Incorrect Login');
      }
    } catch(err){
      console.log(err);
    }
  }
  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
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
  setToken: PropTypes.func.isRequired
};
