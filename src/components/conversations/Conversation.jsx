import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.scss";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (conversation.id !== currentUser.id) {
      setUser(conversation);
    }
  }, [currentUser, conversation]);

  if (user) {
    return (
      <div className="conversation">
        <img className="conversationImg" src={user.avatar} alt="" />
        <span className="conversationName">{user.name}</span>
      </div>
    );
  } else {
    return null; // This will prevent rendering the component
  }
}
