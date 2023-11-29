// socket.js

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let stompClient = null;
const currentUser = JSON.parse(localStorage.getItem("currentUser"));


const sendNotification = (content, userId, username) => {
  if (stompClient && stompClient.connected) {

  if(userId!=currentUser.id){
    const message = {
      content: content,
      recId: userId,
      recName: username,
      createdOn: Date.now(),
      status: "RECEIVED",
    };
  
    stompClient.send("/app/notification", {}, JSON.stringify(message));
  }
}
};


const createdOn = (userName, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, (frame) => {
    console.log("Connected to WebSocket: " + frame);

    if (stompClient.connected) {
      stompClient.subscribe(`/user/${userName}/queue/noti`, (data) => {
        const notification = JSON.parse(data.body);
        onMessageReceived(notification);
        toast.info(notification.content);
        console.log(notification.content);
      });
    } 
    // else {
      // console.error("Hinh nhu chua connect");
    // }
  });
};




const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect();
  }
};

export { createdOn, sendNotification, disconnectWebSocket };
