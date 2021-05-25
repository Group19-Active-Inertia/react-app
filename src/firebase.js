import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyBkpEDGlj06SVpYzIbNr2KCIGfYhXBGysE",
  authDomain: "create-active-inertia.firebaseapp.com",
  databaseURL: "https://create-active-inertia-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "create-active-inertia",
  storageBucket: "create-active-inertia.appspot.com",
  messagingSenderId: "210630963199",
  appId: "1:210630963199:web:8c861d8c3f52ef6a9981ca",
  measurementId: "G-FBEK63TEW5"
};

firebase.initializeApp(config);
export default firebase;