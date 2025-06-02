const admin = require('firebase-admin');

// Dummy service account for development when real one is not available
const dummyServiceAccount = {
    projectId: "dummy-project",
    clientEmail: "dummy@example.com",
    privateKey: "dummy-key"
};

try {
    if (!admin.apps.length) {
        let config;
        try {
            // Try to load the real service account
            const serviceAccount = require('../firebase-service-account.json');
            config = {
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://hotel-buddha-avenue-default-rtdb.firebaseio.com"
            };
            console.log('Initialized Firebase Admin with real service account');
        } catch (error) {
            // If service account file is not found, use dummy config
            config = {
                credential: admin.credential.cert(dummyServiceAccount),
                databaseURL: "https://dummy-project.firebaseio.com"
            };
            console.warn('Firebase service account not found. Using dummy configuration.');
            console.warn('Push notifications will not work until you add the real service account file.');
        }

        admin.initializeApp(config);
    }
} catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    // Don't throw error, let the app continue without Firebase functionality
}

// Export a wrapper that safely handles Firebase operations
module.exports = {
    messaging: () => ({
        send: async (message) => {
            try {
                if (admin.apps.length && !dummyServiceAccount.projectId.includes('dummy')) {
                    return await admin.messaging().send(message);
                }
                console.log('Notification would have been sent:', message);
                return 'dummy-message-id';
            } catch (error) {
                console.error('Error sending message:', error);
                throw error;
            }
        }
    })
}; 