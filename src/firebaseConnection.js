// utilização do banco firebase
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// utilização do auth
import { getAuth } from 'firebase/auth'


// utilização do banco firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPxGUCCKnoT_9f8IJp2VqwSSdQert5x_c",
    authDomain: "weatherproject-397f5.firebaseapp.com",
    projectId: "weatherproject-397f5",
    storageBucket: "weatherproject-397f5.appspot.com",
    messagingSenderId: "1001904131387",
    appId: "1:1001904131387:web:fa7a4d310db8b0e47f7b1e",
    measurementId: "G-24007M7XB4"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

// utilização do auth
const auth = getAuth(firebaseApp)


export { db, auth };