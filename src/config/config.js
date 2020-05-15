import firebase from 'firebase'

let firebaseConfig = {
  apiKey: "AIzaSyBojUB1UWPURDBUr51mD-mjgYXJXmo4g2Y",
  authDomain: "nguyenquoc-c1942.firebaseapp.com",
  databaseURL: "https://nguyenquoc-c1942.firebaseio.com",
  projectId: "nguyenquoc-c1942",
  storageBucket: "nguyenquoc-c1942.appspot.com",
  messagingSenderId: "8991215806",
  appId: "1:8991215806:web:ee4da451b9c0b025220eef"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export const db = firebase.database()