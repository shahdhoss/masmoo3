import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";


const SIGNALING_SERVER_URL = "http://localhost:8080";

const Streamer = () => {
  const {roomName} = useParams();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState(roomName);
  const [myStream, setMyStream] = useState(null);
  const peers = useRef({});

  useEffect(() => {
    if (!isStreaming || !streamId) return;

    let stream;
    let socket;

    const setUpStreaming = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMyStream(stream);
        socket = io(SIGNALING_SERVER_URL);

        socket.emit("room:join", streamId); // Join the room *first*

        socket.on("connect", () => {
          // *Now* emit the streamer-connected event, *inside* the 'connect' handler
          console.log(`Streamer: Connected to socket.io with id: ${socket.id}, emitting room:streamer-connected for room: ${streamId}`);
          socket.emit("room:streamer-connected", socket.id);
        });

        socket.on("room:listener-joined", (listenerId) => {
          console.log(`Streamer: Listener joined: ${listenerId}`);
          if (!peers.current[listenerId]) {
            const peer = new Peer({
              initiator: true,
              stream: stream,
            });

            peer.on("signal", (data) => {
              console.log(`Streamer: Sending signal to ${listenerId}:`, data);
              socket.emit("peer:signal", listenerId, data);
            });

            peer.on("connect", () => {
              console.log(`Streamer: Connected to listener: ${listenerId}`);
            });

            peer.on("error", (err) => {
              console.error(`Streamer: Peer error with ${listenerId}`, err);
            });
            peers.current[listenerId] = peer;
          }
        });

        socket.on("peer:signal", (originId, data) => {
          console.log(`Streamer: Received signal from ${originId}:`, data);
          if (peers.current[originId]) {
            peers.current[originId].signal(data);
          } else {
            console.warn(`Streamer: Received signal for unknown peer: ${originId}`);
          }
        });
      } catch (error) {
        console.error("Streamer: Error setting up stream:", error);
        setIsStreaming(false);
        setMyStream(null);
        if (socket) socket.disconnect();
      }
    };

    setUpStreaming();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setMyStream(null);
      }
      if (socket) socket.disconnect();

      for (let key in peers.current) {
        if (peers.current[key]) {
          peers.current[key].destroy();
        }
      }
      peers.current = {};
    };
  }, [isStreaming, streamId]);

  const startStream = () => {
    setIsStreaming(true);
    console.log("Streamer: Starting stream with ID:", streamId);
  };

  const stopStream = () => {
    setIsStreaming(false);
    setStreamId("");
    console.log("Streamer: Stopping stream");
  };

  return (
    <>
      <h1>Streamer</h1>
      <button onClick={startStream} disabled={isStreaming}>
        Start Streaming Audio
      </button>
      <button onClick={stopStream} disabled={!isStreaming}>
        Stop Streaming
      </button>

      {streamId && <div>Stream ID: {streamId}</div>}
      {myStream && <p>Streaming audio...</p>}
    </>
  );
};

export default Streamer;
