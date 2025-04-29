import React, { useState, useEffect, useRef, useActionState } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const UserAvatar = ({ user }) => {
  useEffect(()=>{
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    link.id = "bootstrap-css";
    document.head.appendChild(link);
    return () => {
      const existing = document.getElementById("bootstrap-css");
      if (existing) existing.remove();
    };
  })
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

// Chat Component
const Chat = () => {
  useEffect(()=>{
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    link.id = "bootstrap-css";
    document.head.appendChild(link);
    return () => {
      const existing = document.getElementById("bootstrap-css");
      if (existing) existing.remove();
    };
  })
  const messages = [
    { user: 'Abhiraj', message: 'Hello everyone!', time: '10:45 AM' },
    { user: 'Sarah', message: 'Hi Abhiraj, how are you?', time: '10:46 AM' },
    { user: 'You', message: 'Welcome to the meeting!', time: '10:47 AM' }
  ];

  return (
    <div className="text-white d-flex flex-column" style={{ width: '300px', backgroundColor: "#FFFFFF" }}> 
  <div className="p-3 border-bottom border-secondary" style={{ backgroundColor: "#FFFFFF" }}> 
    <h5 style={{ color: "#343A40" }}>Chat</h5> 
  </div>

  <div className="flex-grow-1 overflow-auto p-3">
    {messages.map((msg, idx) => (
      <div key={idx} className={`d-flex ${msg.user === 'You' ? 'justify-content-end' : ''} mb-3`}>
        <div
          style={{
            backgroundColor: msg.user === 'You' ? "#29ABE2" : "#F0F0F0",
            color: "#343A40",
            maxWidth: '80%',
          }}
          className="rounded p-2"
        >
          {msg.user !== 'You' && <p className="fw-medium small mb-1" style={{ color: "#343A40" }}>{msg.user}</p>} 
          <p className="small mb-1">{msg.message}</p>
          <p className="text-muted small mb-0 text-end">{msg.time}</p> 
        </div>
      </div>
    ))}
  </div>

  <div className="p-3 border-top border-secondary" style={{ backgroundColor: "#FFFFFF" }}> {/* White Input Background */}
    <div className="d-flex">
      <input
        type="text"
        className="form-control"
        placeholder="Type a message..."
        style={{ height: '40px', flexGrow: 1, backgroundColor: "#F8F9FA", color: "#343A40", borderColor: "#CED4DA" }} // Light Gray Input, Dark Text
      />
      <button className="btn btn-primary ms-2" style={{ height: '40px', backgroundColor: "#00C7BE", borderColor: "#00C7BE" }}> {/* Vibrant Teal Send Button */}
        <i className="bi bi-send"></i>
      </button>
    </div>
  </div>
</div>
  );
};
const SIGNALING_SERVER_URL = "http://localhost:8080";

const StreamerMeetLayout = () => {
  const { roomName } = useParams();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState(roomName);
  const [myStream, setMyStream] = useState(null);
  const [listeners, setListeners] = useState([]);
  const [userData, setUserData] = useState({});
  const peers = useRef({});
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // Load user data and Bootstrap CSS
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

  // Set up streaming and socket connections
  useEffect(() => {
    if (!isStreaming || !streamId) return;

    let stream;
    const setupStreaming = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMyStream(stream);

        const socket = io(SIGNALING_SERVER_URL);
        socketRef.current = socket;

        // Register user data as soon as connected
        socket.on("connect", () => {
          console.log(`Streamer connected with socket ID: ${socket.id}`);
          
          // Register user data first before joining room
          socket.emit("register_user", {
            id: userData.id,
            first_name: userData.first_name || "Streamer",
            profile_pic: userData.profile_pic || "",
          });
          
          // Then join the room
          socket.emit("room:join", streamId);
          socket.emit("room:streamer-connected", socket.id);
        });

        socket.on("room:listener-joined", (listenerId, listenerInfo) => {
          console.log(`New listener joined: ${listenerId}`);
          console.log("listener info: ", listenerInfo);

          // Safely add listener with fallbacks for missing data
          setListeners(prev => {
            if (prev.some(l => l.socketId === listenerId)) return prev;
            
            return [
              ...prev,
              {
                id: listenerInfo?.id || listenerId,
                socketId: listenerId,
                name: listenerInfo?.first_name || `User ${listenerId.slice(0, 4)}`,
                picture: listenerInfo?.profile_pic || "",
                isSpeaking: false
              }
            ];
          });

          if (!peers.current[listenerId]) {
            const peer = new Peer({
              initiator: true,
              stream: stream,
            });

            peer.on("signal", (data) => {
              socket.emit("peer:signal", listenerId, data);
            });

            peer.on("connect", () => {
              console.log(`Connected to listener ${listenerId}`);
            });

            peer.on("error", (err) => {
              console.error(`Peer error with ${listenerId}`, err);
            });

            peers.current[listenerId] = peer;
          }
        });

        socket.on("room:listener-left", (listenerId) => {
          console.log(`Listener left: ${listenerId}`);
          
          setListeners(prev => prev.filter(l => l.socketId !== listenerId));
        
          if (peers.current[listenerId]) {
            peers.current[listenerId].destroy();
            delete peers.current[listenerId];
          }
        });
        
        socket.on("peer:signal", (originId, data) => {
          const peer = peers.current[originId];
          if (peer) {
            peer.signal(data);
          } else {
            console.warn(`No peer found for signal from ${originId}`);
          }
        });
      } catch (err) {
        console.error("Streamer setup failed:", err);
        setIsStreaming(false);
        setMyStream(null);
        if (socketRef.current) socketRef.current.disconnect();
      }
    };

    setupStreaming();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      Object.values(peers.current).forEach(peer => peer.destroy());
      peers.current = {};
      setMyStream(null);
      setListeners([]);
    };
  }, [isStreaming, streamId, userData]);

  const startStream = () => {
    setIsStreaming(true);
  };

  const stopStream = () => {
    setIsStreaming(false);
    setStreamId("");
  };

  const streamer = {
    name: userData.first_name || "Streamer",
    picture: userData.profile_pic || "",
    isSpeaking: true
  };
  
  const handleGoHome = () => {
    navigate("/home")
  }
  
  const users = [streamer, ...listeners];
  console.log("users: ", users)
  
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
          onClick={startStream}
          disabled={isStreaming}
          className="btn rounded-circle"
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: isStreaming ? "#B0E0E6" : "#29ABE2",
            color: "#FFFFFF",
          }}
        >
          <i className="bi bi-mic fs-4"></i>
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
    <Chat style={{ backgroundColor: "#FFFFFF" }} />
  </div>
  );
};

export default StreamerMeetLayout;