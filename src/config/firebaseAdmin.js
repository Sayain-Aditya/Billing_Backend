require('dotenv').config();
const admin = require("firebase-admin");

// Parse the service account credentials from the environment variable
const serviceAccount = JSON.parse(process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT);

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hotel-buddha-avenue-default-rtdb.firebaseio.com"
  });
}

module.exports = admin;