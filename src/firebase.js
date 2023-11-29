// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBdyYfBWrveQxH8aPRAiLXQ3w7QTFESbj8",
  authDomain: "notify-79750.firebaseapp.com",
  projectId: "notify-79750",
  storageBucket: "notify-79750.appspot.com",
  messagingSenderId: "483762712901",
  appId: "1:483762712901:web:2887efccac3e5d8bb38e2c",
  measurementId: "G-92GTBK54JV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermissions = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification User Permission Granted");
      return getToken(messaging, {
        vapidKey:
          "BNKXmaoz0QKRSyHHiZqJlXU6MRRACUoqpfP3_6QwE-qy4BE-WfWZrdlzV45ovE9KCAVox306ULJvElpe4OAO-CU",
      })
        .then((currentToken) => {
          if (currentToken) {
            console.log("Client Token: ", currentToken);
          } else {
            console.log("Fail to generate the app");
          }
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    } else {
      console.log("User Permission Denied");
    }
  });
};

requestPermissions();

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
