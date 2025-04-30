import React, { useState, useEffect, useRef } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate, useParams } from "react-router-dom";
import Peer from "simple-peer";
import { io } from "socket.io-client";
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
          src={user.profile_pic} 
          className="rounded-circle" 
          alt={`${user.first_name}'s profile`}
          style={{ width: '150px', height: '150px', objectFit: 'cover' }} // Increased width and height
        />
        {user.isSpeaking && (
          <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle border border-2 border-success" 
               style={{ animation: 'pulse 1.5s infinite' }}></div>
        )}
      </div>
      <p className="mt-2 fw-medium">{user.first_name}</p>
    </div>
  );
}

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
    <div className="text-white d-flex flex-column" style={{ width: '300px', backgroundColor: "#FFFFFF" }}> {/* White Chat Background */}
  <div className="p-3 border-bottom border-secondary" style={{ backgroundColor: "#FFFFFF" }}> {/* White Header Background */}
    <h5 style={{ color: "#343A40" }}>Chat</h5> {/* Dark Gray Header Text */}
  </div>

  <div className="flex-grow-1 overflow-auto p-3">
    {messages.map((msg, idx) => (
      <div key={idx} className={`d-flex ${msg.user === 'You' ? 'justify-content-end' : ''} mb-3`}>
        <div
          style={{
            backgroundColor: msg.user === 'You' ? "#29ABE2" : "#F0F0F0", // Lively Blue for User, Light Gray for Others
            color: "#343A40", // Dark Gray Text
            maxWidth: '80%',
          }}
          className="rounded p-2"
        >
          {msg.user !== 'You' && <p className="fw-medium small mb-1" style={{ color: "#343A40" }}>{msg.user}</p>} {/* Dark Gray Username */}
          <p className="small mb-1">{msg.message}</p>
          <p className="text-muted small mb-0 text-end">{msg.time}</p> {/* Muted Timestamp */}
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
const ListenerMeetLayout = () => {
    const { roomName } = useParams();
    const [isListening, setIsListening] = useState(false);
    const [userData, setUserData] = useState({});
    const [peers, setPeers] = useState([]);
    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const navigate = useNavigate();

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
        return ()=>{
        const existing = document.getElementById("bootstrap-css");
        if (existing) existing.remove();
        }
    }, []);

    useEffect(() => {
        if (!isListening) return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
        link.id = "bootstrap-css";
        document.head.appendChild(link);
        
        if (!userData) { 
          console.log("User data not available");
          return;
        }
        
        if (!roomName) {
          console.log("Listener: roomName is not available");
          return;
        }

        const socket = io(SIGNALING_SERVER_URL);
        socketRef.current = socket;
        
        const peer = new Peer({ initiator: false });
        peerRef.current = peer;

        let streamerId;
        console.log(`Listener: Joining room: ${roomName}`);
        socket.emit("register_user", userData);
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

        socket.on("connect", () => {
          setTimeout(() => {
            socket.emit("get_peers");
          }, 500);
        });
        
        socket.on("peers_list", (peersList) => {
          console.log("peers list received: ", peersList);
          const uniquePeers = [];
          const seenIds = new Set();
          
          peersList.forEach(peer => {
            if (peer.id && !seenIds.has(peer.id)) {
              seenIds.add(peer.id);
              uniquePeers.push(peer);
            }
          });
          
          setPeers(uniquePeers);
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
          const existing = document.getElementById("bootstrap-css");
          if (existing) existing.remove();
        };
    }, [isListening, roomName, userData]);

    const handleListenClick = () => {
      if (!isListening) {
        if (roomName) {
          setIsListening(true);
          console.log("Listener: setIsListening(true)");
        } else {
          console.error("Listener: Room name is not available in the URL.");
        }
      } else {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        if (peerRef.current) {
          peerRef.current.destroy();
        }
        setIsListening(false);
        setPeers([]);
      }
    };
  
  const handleGoHome = () => {
    navigate('/');
  };
    return (
      <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="d-flex flex-column flex-grow-1">
          <div className="flex-grow-1 p-4 overflow-auto">
            <div className="row g-4">
              {peers.map((user, idx) => (
                <div key={user.id || idx} className="col-6 col-md-4 col-lg-3">
                  <UserAvatar user={user} />
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 d-flex justify-content-center gap-3" style={{backgroundColor:"#FFFFFF"}}>
            <button 
              onClick={handleListenClick} 
              className={`btn ${isListening ? "btn-danger" : "btn-success"} rounded-circle d-flex align-items-center justify-content-center`} 
              style={{ width: '60px', height: '60px' }}>
                <i className={`bi ${isListening ? "bi-stop" : "bi-headphones"} fs-4`}></i>
            </button>
            <button onClick={handleGoHome} style ={{width:"60px", height:"60px"}} className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center">
              <i className=" bi bi-box-arrow-right fs-4" ></i>
            </button>
          </div>
        </div>
        
        <Chat />
      </div>
    );
};

export default ListenerMeetLayout;
