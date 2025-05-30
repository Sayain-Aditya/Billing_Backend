// utils/firebase.js

const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBXjRhtr7xbTGTpuT07BJe_0QBvJSCq8_o",
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

module.exports = { storage, ref, uploadBytes, getDownloadURL, deleteObject };
