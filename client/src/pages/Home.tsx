import { useState, useEffect } from "react";
import { socket } from "../providers/Socket";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [emailId, setEmailId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRoomJoin = () => {
    socket.emit("join-room", { emailId, roomId });
    navigate(`room/${roomId}`);
  };

  return (
    <div className="homepage-container">
      <div className="input-container">
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
        <button onClick={handleRoomJoin}>Enter Room</button>
      </div>
    </div>
  );
}
