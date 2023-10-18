/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useCallback } from "react";
import ReactPlayer from "react-player";

import { useSocketContext } from "../providers/SocketProvider";
import { useParams } from "react-router-dom";
import peer from "../services/peer";

export default function Room() {
  const { socket } = useSocketContext();
  const params = useParams();

  socket.emit("room-joined", params.roomId?.toString());

  const [remoteSocketId, setRemoteSocketId] = useState("");
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalled, setisCalled] = useState<boolean>(false);
  const [isCallAccepted, setisCallAccepted] = useState<boolean>(false);

  const handleRoomJoined = useCallback((data: any) => {
    if (data) return setRemoteSocketId(data.id);
  }, []);

  const handleIncommingCall = useCallback(
    async (data: any) => {
      const ans = await peer.getAnswer(data.offer);
      setRemoteSocketId(data.from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      socket.emit("call-accepted", { to: data.from, ans });
    },
    [socket]
  );

  const sendSteam = useCallback(() => {
    if (!myStream) return;
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
    setisCallAccepted(true);
  }, [myStream]);

  const handleCallAccepted = useCallback(
    async (data: any) => {
      await peer.setLocalDescription(data.ans);
      sendSteam();
    },
    [sendSteam]
  );

  const handleNagotiationIncomming = useCallback(
    async (data: any) => {
      const ans = await peer.getAnswer(data.offer);
      socket.emit("nagotiation-done", { to: data.from, ans });
    },
    [socket]
  );

  const handleNagotiationDone = useCallback(async (data: any) => {
    await peer.setLocalDescription(data.ans);
  }, []);

  useEffect(() => {
    socket.on("room:joined", handleRoomJoined);
    socket.on("incomming-call", handleIncommingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("nagotiation", handleNagotiationIncomming);
    socket.on("nagotiation-done", handleNagotiationDone);
    return () => {
      socket.off("room:joined", handleRoomJoined);
      socket.off("incomming-call", handleIncommingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("nagotiation", handleNagotiationDone);
    };
  }, [
    socket,
    handleRoomJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNagotiationIncomming,
    handleNagotiationDone,
  ]);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("call-user", { to: remoteSocketId, offer });

    setMyStream(stream);
    setisCalled(true);
  }, [remoteSocketId, socket]);

  const handleNagotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("nagotiation", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNagotiationNeeded);
    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNagotiationNeeded
      );
    };
  }, [handleNagotiationNeeded]);

  const handleSetRemoteStream = useCallback(async (event: any) => {
    const remoteStream = event.streams;
    setRemoteStream(remoteStream[0]);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", handleSetRemoteStream);
    return () => {
      peer.peer.removeEventListener("track", handleSetRemoteStream);
    };
  }, [handleSetRemoteStream]);

  return (
    <div className="room">
      <h1>Room</h1>
      <div>
        {remoteSocketId && !isCalled ? (
          <button onClick={handleCallUser}>Call</button>
        ) : (
          <h4>No one in room</h4>
        )}
        {myStream && !isCallAccepted && (
          <button onClick={sendSteam}>Accept Call</button>
        )}
      </div>
      <div className="stream">
        {myStream && (
          <div>
            <h1>My stream</h1>
            <ReactPlayer
              playing
              muted
              height="200px"
              width="300px"
              url={myStream}
            />
          </div>
        )}
        {remoteStream && (
          <div>
            <h1>Remote stream</h1>
            <ReactPlayer
              playing
              muted
              height="200px"
              width="300px"
              url={remoteStream}
            />
          </div>
        )}
      </div>
    </div>
  );
}
