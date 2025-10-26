// services/firebaseService.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Get absolute path to JSON
const __dirname = path.resolve();
const serviceAccountPath = path.join(__dirname, "admin-key.json");

// Read and parse JSON
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
