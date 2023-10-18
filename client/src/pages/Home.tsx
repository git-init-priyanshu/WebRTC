import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useSocketContext } from "../providers/SocketProvider";

export default function Home() {
  const navigate = useNavigate();
  const { socket } = useSocketContext();

  const [emailId, setEmailId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const handleSubmitForm = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      socket.emit("join-room", { emailId, roomId });
      navigate(`/room/${roomId}`);
    },
    [socket, emailId, roomId, navigate]
  );

  return (
    <div className="homepage-container">
      <div className="input-container">
        <form onSubmit={handleSubmitForm}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email id"
            value={emailId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmailId(e.target.value);
            }}
          />
          <label>Room Id</label>
          <input
            type="text"
            placeholder="Enter Room code"
            value={roomId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setRoomId(e.target.value);
            }}
          />
          <button type="submit">Enter Room</button>
        </form>
      </div>
    </div>
  );
}
