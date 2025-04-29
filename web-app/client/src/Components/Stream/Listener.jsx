import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Peer from "simple-peer";
import { io } from "socket.io-client";

const SIGNALING_SERVER_URL = "http://localhost:8080";

const Listener = () => {
  const { roomName } = useParams();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!roomName) {
      console.log("Listener: roomName is not available");
      return;
    }

    const socket = io(SIGNALING_SERVER_URL);
    const peer = new Peer({ initiator: false });

    let streamerId;

    console.log(`Listener: Joining room: ${roomName}`);
    socket.emit("room:join", roomName);

    socket.once("room:streamer-connected", (originId) => {
      streamerId = originId;
      console.log("Listener: Streamer connected:", streamerId);
    });

    socket.on("peer:signal", (_, data) => {
      console.log("Listener: Received peer signal:", data);
      peer.signal(data);
    });

    peer.on("signal", (data) => {
      console.log("Listener: Sending peer signal:", data);
      socket.emit("peer:signal", streamerId, data);
    });

    peer.on("stream", (stream) => {
      console.log("Listener: Received stream:", stream);
      if (stream.getAudioTracks().length > 0) {
        console.log("Stream has audio tracks, starting playback...");
        
        const audio = new Audio();
        audio.srcObject = stream;
        audio.play().catch(console.error);
      } else {
        console.error("No audio tracks in the stream!");
      }
    });

    peer.on("connect", () => {
        console.log("Listener: Peer connected!");
    });

    peer.on("error", (err) => {
        console.error("Listener: Peer error", err);
    });

    return () => {
      console.log("Listener: Disconnecting");
      socket.disconnect();
      peer.destroy();
    };
  }, [isListening, roomName]);

  const handleListenClick = () => {
    if (roomName) {
      setIsListening(true);
      console.log("Listener: setIsListening(true)");
    } else {
      console.error("Listener: Room name is not available in the URL.");
    }
  };

  return (
    <>
      <h1>Listener for Room: {roomName}</h1>
      <button onClick={handleListenClick} disabled={isListening}>
        Listen to Audio Stream
      </button>
    </>
  );
  
};

export default Listener;
