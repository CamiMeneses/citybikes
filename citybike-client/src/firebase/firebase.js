import firebase from 'firebase/app';
import 'firebase/firestore'
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCaRQqWkqqAC-cEkYCTER1oMzlEvyhFoDY",
  authDomain: "citybike-miami.firebaseapp.com",
  databaseURL: "https://citybike-miami.firebaseio.com",
  projectId: "citybike-miami",
  storageBucket: "citybike-miami.appspot.com",
  messagingSenderId: "416129179530",
  appId: "1:416129179530:web:258c09fada0ffffed17273"
};
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);

export const db = fb.firestore();
