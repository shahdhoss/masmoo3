import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import {getSocket, disconnectSocket} from "../../socket_instance.js"
import Chat from "./Chat.jsx";

const UserAvatar = ({ user }) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    link.id = "bootstrap-css";
    document.head.appendChild(link);
    return () => {
      const existing = document.getElementById("bootstrap-css");
      if (existing) existing.remove();
    };
  }, []);
  
  return (
    <div className="d-flex flex-column align-items-center mb-4">
      <div className="position-relative">
        <img 
          src={user.picture} 
          className="rounded-circle" 
          alt={`${user.name}'s profile`}
          style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
        />
        {user.isSpeaking && (
          <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle border border-2 border-success" 
               style={{ animation: 'pulse 1.5s infinite' }}></div>
        )}
      </div>
      <p className="mt-2 fw-medium">{user.name}</p>
    </div>
  );
}
const StreamerMeetLayout = () => {
  const { roomName } = useParams();
  const [isMuted, setIsMuted] = useState(false);
  const [streamId, setStreamId] = useState(roomName);
  const [myStream, setMyStream] = useState(null);
  const [listeners, setListeners] = useState([]);
  const [userData, setUserData] = useState({});
  const peers = useRef({});
  const socketRef = useRef(null);
  const audioTrackRef = useRef(null);
  const navigate = useNavigate()
  const socketInitialized = useRef(false)

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    link.id = "bootstrap-css";
    document.head.appendChild(link);

    axios.get("http://localhost:8080/user/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then((response) => {
      setUserData(response.data);
    });
    
    return () => {
      const existing = document.getElementById("bootstrap-css");
      if (existing) existing.remove();
    }
  }, []);


  useEffect(() => {
    if (!streamId || !userData?.id || socketInitialized.current) return;
    socketInitialized.current = true;

    let stream;
    const socket = getSocket();

    const setupStreaming = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMyStream(stream);
        audioTrackRef.current = stream.getAudioTracks()[0];

        socket.connect(); 
        socketRef.current = socket;

        socket.on("connect", () => {
          console.log(`Connected with socket ID: ${socket.id}`);
          socket.emit("register_user", {
            id: userData.id,
            first_name: userData.first_name || "Streamer",
            profile_pic: userData.profile_pic || "",
          });
          socket.emit("room:join", streamId);
          socket.emit("room:streamer-connected", socket.id);
        });

        socket.on("room:listener-joined", (listenerId, listenerInfo) => {
          console.log("Listener joined: ", listenerInfo);
          setListeners(prev => {
            if (prev.some(l => l.socketId === listenerId)) return prev;
            return [...prev, {
              id: listenerInfo?.id || listenerId,
              socketId: listenerId,
              name: listenerInfo?.first_name || `User ${listenerId.slice(0, 4)}`,
              picture: listenerInfo?.profile_pic || "",
              isSpeaking: false,
            }];
          });

          if (!peers.current[listenerId]) {
            const peer = new Peer({ initiator: true, stream });
            peer.on("signal", data => socket.emit("peer:signal", listenerId, data));
            peer.on("connect", () => console.log(`Connected to ${listenerId}`));
            peer.on("error", err => console.error(`Peer error ${listenerId}:`, err));
            peers.current[listenerId] = peer;
          }
        });

        socket.on("room:listener-left", (listenerId) => {
          console.log("Listener left: ", listenerId);
          setListeners(prev => prev.filter(l => l.socketId !== listenerId));
          if (peers.current[listenerId]) {
            peers.current[listenerId].destroy();
            delete peers.current[listenerId];
          }
        });
        
        socket.on("peer:signal", (originId, data) => {
          const peer = peers.current[originId];
          if (peer) peer.signal(data);
          else console.warn(`No peer for ${originId}`);
        });
      } catch (err) {
        console.error("Setup failed:", err);
        if (socketRef.current) socketRef.current.disconnect();
      }
    };

    setupStreaming();

    return () => {
      socketInitialized.current = false;
      if (stream) stream.getTracks().forEach(t => t.stop());
      disconnectSocket();
      Object.values(peers.current).forEach(p => p.destroy());
      peers.current = {};
      setListeners([]);
      setMyStream(null);
    };
  }, [streamId, userData]);

  const toggleMute = () => {
    if (audioTrackRef.current) {
      audioTrackRef.current.enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };
  
  
  const streamer = {
    name: userData.first_name || "Streamer",
    picture: userData.profile_pic || "",
    isSpeaking: !isMuted
  };
  
  const users = [streamer, ...listeners];
  console.log("users: ", users);
  
  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="d-flex flex-column flex-grow-1">
        <div className="flex-grow-1 overflow-auto p-4">
          <div className="row g-4">
            {users.map((user, idx) => (
              <div key={idx} className="col-6 col-md-4 col-lg-3">
                <UserAvatar user={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 d-flex justify-content-center gap-3" style={{ backgroundColor: "#FFFFFF" }}>
          <button
            onClick={toggleMute}
            className="btn rounded-circle"
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: isMuted ? "#FF6B6B" : "#29ABE2",
              color: "#FFFFFF",
            }}
          >
            <i className={`bi ${isMuted ? "bi-mic-mute" : "bi-mic"} fs-4`}></i>
          </button>
          <button 
            onClick={handleGoHome}
            className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '60px', height: '60px', backgroundColor: "#FF6B6B", color: "#FFFFFF" }}
          >
            <i className="bi bi-box-arrow-right fs-4"></i>
          </button>
        </div>
      </div>
      <Chat style={{ backgroundColor: "#FFFFFF" }} socketRef={socketRef} streamId={streamId} userId={userData.id}/>
    </div>
  );
};

export default StreamerMeetLayout;