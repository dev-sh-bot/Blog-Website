"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasClientConfig = [firebaseConfig.apiKey, firebaseConfig.authDomain, firebaseConfig.projectId, firebaseConfig.storageBucket, firebaseConfig.messagingSenderId, firebaseConfig.appId].every((value) => typeof value === "string" && value.length > 0);
export const clientFirebaseApp = hasClientConfig ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
export const clientAuth = clientFirebaseApp ? getAuth(clientFirebaseApp) : null;
export const clientDb = clientFirebaseApp ? getFirestore(clientFirebaseApp) : null;
export const clientStorage = clientFirebaseApp ? getStorage(clientFirebaseApp) : null;
export const clientRealtimeDb = clientFirebaseApp && firebaseConfig.databaseURL ? getDatabase(clientFirebaseApp) : null;

if (clientAuth && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
  connectAuthEmulator(clientAuth, "http://127.0.0.1:9099", { disableWarnings: true });
  if (clientDb) connectFirestoreEmulator(clientDb, "127.0.0.1", 8080);
  if (clientStorage) connectStorageEmulator(clientStorage, "127.0.0.1", 9199);
  if (clientRealtimeDb) connectDatabaseEmulator(clientRealtimeDb, "127.0.0.1", 9000);
}
