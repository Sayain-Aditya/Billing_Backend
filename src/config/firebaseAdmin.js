const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-account.json");

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hotel-buddha-avenue-default-rtdb.firebaseio.com"
  });
}

module.exports = admin;