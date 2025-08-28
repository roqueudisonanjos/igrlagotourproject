import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBl22spyfkbeHUzOhwSeOtVCDAIYJhxHwE",
  authDomain: "igr-lago-tour.firebaseapp.com",
  projectId: "igr-lago-tour",
  storageBucket: "igr-lago-tour.appspot.com",
  messagingSenderId: "1049430657076",
  appId: "1:1049430657076:web:ab7ecf9f5a9bf3a6992261",
  measurementId: "G-3GTTXD5F8R"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export default app;