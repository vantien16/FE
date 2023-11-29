import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { requestPermissions, onMessageListener } from "../../firebase";
import { useState } from "react";
import { useEffect } from "react";

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });

  useEffect(() => {
    requestPermissions();

    const unsubscribe = onMessageListener().then((payload) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });

      toast.success(
        `${payload?.notification?.title}: ${payload?.notification?.body}`,
        {
          duration: 6000,
          position: "top-right",
        }
      );
    });
    return () => {
      unsubscribe.catch((err) => console.log("Fail: ", err));
    };
  }, []);

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default Notification;
