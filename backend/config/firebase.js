const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin SDK
// Expects GOOGLE_APPLICATION_CREDENTIALS env var to be set 
// or FIREBASE_SERVICE_ACCOUNT keys to be present in .env

// If you are using a service account JSON file (recommended for local dev):
// process.env.GOOGLE_APPLICATION_CREDENTIALS = "path/to/serviceAccountKey.json";

// Alternatively, parse from individual env vars (common in some hosting environments)
/*
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
};

if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.initializeApp();
}
*/

// For simplicity and standard usage:
if (!admin.apps.length) {
    // If FIREBASE_SERVICE_ACCOUNT is available (e.g. JSON string)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        // Fallback to default application credentials (good for Cloud Run/Functions)
        admin.initializeApp();
    }
}

module.exports = admin;
