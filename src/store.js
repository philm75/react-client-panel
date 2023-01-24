import { createStore, combineReducers, compose } from 'redux';
import firebase from 'firebase';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';

// Reducers
import notifyReducer from './reducers/notifyReducer';
import settingsReducer from './reducers/settingsReducer';

const firebaseConfig = {
    apiKey: "AIzaSyA_Iah4Y9mItx34gy1JnBmObcZlqjpEER0",
    authDomain: "react-client-panel-52522.firebaseapp.com",
    databaseURL: "https://react-client-panel-52522.firebaseio.com",
    projectId: "react-client-panel-52522",
    storageBucket: "react-client-panel-52522.appspot.com",
    messagingSenderId: "179719132857"
};

// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true 
}

// Init firebase instance
firebase.initializeApp(firebaseConfig);

// Init firestore
//Removed as it was causing a bug....
const firestore = firebase.firestore();
// timestampInSnapshots: true
const settings = {};
firestore.settings(settings); 

const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
)(createStore);

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    notify: notifyReducer,
    settings: settingsReducer
});

// Check for settings in local storage
if (localStorage.getItem('settings') == null) {
    // Defaults
    const defaultSettings = {
        disableBalanceOnAdd  : true,
        disableBalanceOnEdit : false,
        allowRegistration    : false
    }

    // Set to local storage
    localStorage.setItem('settings', JSON.stringify(defaultSettings));
}

// Create initial state
const intialState = {
    settings : JSON.parse(localStorage.getItem('settings'))
};

// Create store
const store = createStoreWithFirebase(rootReducer, intialState, compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;