import React, { useState, useEffect, useRef } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate, useParams } from "react-router-dom";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import axios from 'axios';
import Chat from "./Chat";

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
        
        <Chat socketRef={socketRef} streamId={roomName} userId={userData.id}  />
      </div>
    );
};

export default ListenerMeetLayout;
