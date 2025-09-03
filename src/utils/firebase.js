// utils/firebase.js

const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");
const admin = require('firebase-admin');

// Firebase Admin initialization for authentication
const serviceAccount = require('../config/firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Firebase Client initialization for storage
const firebaseConfig = {
  apiKey: "AIzaSyBXpJ1dv_3SDq9TVa-_hoSoT4CFteNJsBM",
  authDomain: "billing-eef2f.firebaseapp.com",
  databaseURL: "https://billing-eef2f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "billing-eef2f",
  storageBucket: "gs://hotel-buddha-avenue.firebasestorage.app",
  messagingSenderId: "528156471253",
  appId: "1:528156471253:web:a4bbd33b10a9ea4584575c",
  measurementId: "G-3S1MYDPFN5"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Export both admin (for auth) and storage functions
module.exports = { 
  admin,
  storage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
};
