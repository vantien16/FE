import "./message.css";
import { format } from "timeago.js";

export default function Message({ message, own, selectedUser }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img className="messageImg" src={selectedUser.avatar} alt="" />
        <p className="messageText">{message.content}</p>
      </div>
      <div className="messageBottom">{format(message.createdOn)}</div>
    </div>
  );
}
