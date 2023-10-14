import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useSocketContext } from "../providers/SocketProvider";

export default function Home() {
  const navigate = useNavigate();
  const { socket } = useSocketContext();

  const [emailId, setEmailId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  interface dataInterface {
    emailId: string;
    roomId: string;
  }

  const handleJoinRoom = useCallback((data: dataInterface) => {
    const { emailId, roomId } = data;
    navigate(`/room/${roomId}`);
  }, []);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleJoinRoom);
    return () => {
      socket.off("user-joined", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  const handleSubmitForm = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      socket.emit("join-room", { emailId, roomId });
    },
    [emailId, roomId, socket]
  );

  return (
    <div className="homepage-container">
      <div className="input-container">
        <form onSubmit={handleSubmitForm}>
          <input
            type="email"
            placeholder="Enter your email id"
            value={emailId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmailId(e.target.value);
            }}
          />
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
