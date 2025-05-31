// firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./config/firebase-service-account.json"); // path to your downloaded key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;