import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const FirebaseConfig = () =>{

    const firebaseConfig = {
      apiKey: "AIzaSyD0DFCrt4Pp9XYsBQdrEcl7G0Tz9ybc8IY",
      authDomain: "kbp-college-86c63.firebaseapp.com",
      databaseURL: "https://kbp-college-86c63-default-rtdb.firebaseio.com",
      projectId: "kbp-college-86c63",
      storageBucket: "kbp-college-86c63.appspot.com",
      messagingSenderId: "84723723608",
      appId: "1:84723723608:web:fb6d08d48fd831f322492d",
      measurementId: "G-1YHGEKTB41"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    return initializeApp(firebaseConfig);
}

export default FirebaseConfig;