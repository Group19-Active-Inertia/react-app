import React, {useRef} from 'react';
import { auth } from './firebase.js';
import './SignIn.css'


const SignIn = () => {
	
const emailRef = useRef(null);
const passwordRef = useRef(null);

const signUp = e => {
		e.preventDefault();
		auth.createUserWithEmailAndPassword(
		emailRef.current.value, passwordRef.current.value
		).then(user => {
		console.log(user)
		}).catch(err => {
		console.log(err)
		})
	}

	
const signIn = e => {
e.preventDefault();
auth.signInWithEmailAndPassword(
emailRef.current.value, passwordRef.current.value
).then(user => {
console.log('user', user)

}).catch(err => {
console.log(err)
})
}
	return (
<div className="signin">
<form action="">
<h1>Sign in</h1>

<input ref={emailRef} type="email" placeholder="Email"/>
<input ref={passwordRef} type="password" placeholder="Password"/>

<button onClick={signIn}>Sign in</button>

<button onClick={signUp} >Sign up</button>

</form>
</div>
)
}


export default SignIn


// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import './Login.css';

// async function loginUser(credentials) {
//  return fetch('http://neru-api.herokuapp.com/weblogin', {
//    mode: 'no-cors',
//    method: 'POST',
//    headers: {
//      'Content-Type': 'application/json'
//    },
//    body: JSON.stringify(credentials)
//  })
//    .then(data => data.json())
// }

// export default function Login({ setToken }) {
//   const [email, setUserName] = useState();
//   const [password, setPassword] = useState();

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const token = await loginUser({
//       email,
//       password
//     });
//     setToken(token);
//   }

//   return(
//     <div className="login-wrapper">
//       <h1>Please Log In</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           <p>Email</p>
//           <input type="text" onChange={e => setUserName(e.target.value)} />
//         </label>
//         <label>
//           <p>Password</p>
//           <input type="password" onChange={e => setPassword(e.target.value)} />
//         </label>
//         <div>
//           <button type="submit">Submit</button>
//         </div>
//       </form>
//     </div>
//   )
// }

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired
// };
