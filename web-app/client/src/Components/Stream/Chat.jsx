import React, { useState, useEffect, useRef } from "react";

const Chat = ({ socketRef, streamId, userId }) => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState(new Map());
    const messagesEndRef = useRef(null);
  
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
    
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    useEffect(() => {
      if (!socketRef.current) return;
  
      const socket = socketRef.current;
  
      const handleMessage = ({ senderId, message, timestamp, senderName }) => {
        const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit'
        });
        
        setMessages(prev => [...prev, { 
          senderId, 
          message, 
          time: formattedTime,
          senderName: senderName || users.get(senderId)?.name || `User ${senderId.slice(0, 4)}`
        }]);
      };
  
      // Handle user list updates
      const handlePeersList = (peersList) => {
        const newUsers = new Map();
        peersList.forEach(user => {
          if (user.id || user.socketId) {
            const id = user.socketId || user.id;
            newUsers.set(id, {
              name: user.first_name || user.name || `User ${id.slice(0, 4)}`,
              picture: user.profile_pic || user.picture || ""
            });
          }
        });
        setUsers(newUsers);
      };
  
      socket.on("chat:message", handleMessage);
      socket.on("peers_list", handlePeersList);
      
      socket.emit("get_peers");
  
      return () => {
        socket.off("chat:message", handleMessage);
        socket.off("peers_list", handlePeersList);
      };
    }, [socketRef, users]);
  
    const sendMessage = () => {
      if (!newMessage.trim()) return;
  
      const timestamp = new Date().toISOString();
      const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      });
  
      const msgData = {
        roomId: streamId,
        message: newMessage,
        timestamp: timestamp,
        senderName: "You"
      };
  
      socketRef.current.emit("chat:message", msgData);
  
      setMessages(prev => [
        ...prev,
        { 
          senderId: userId, 
          message: newMessage, 
          time: formattedTime,
          senderName: "You"
        }
      ]);
  
      setNewMessage("");
    };
    console.log(messages)
    return (
      <div className="text-white d-flex flex-column" style={{ width: '300px', backgroundColor: "#FFFFFF" }}> 
        <div className="p-3 border-bottom border-secondary" style={{ backgroundColor: "#FFFFFF" }}> 
          <h5 style={{ color: "#343A40" }}>Chat</h5> 
        </div>
  
        <div className="flex-grow-1 overflow-auto p-3">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`d-flex ${msg.senderId === userId ? 'justify-content-end' : ''} mb-3`}
            >
              <div
                style={{
                  backgroundColor: msg.senderId === userId ? "#29ABE2" : "#F0F0F0",
                  color: msg.senderId === userId ? "#FFFFFF" : "#343A40",
                  maxWidth: '80%',
                }}
                className="rounded p-2"
              >
                {msg.senderId !== userId && (
                  <p className="fw-medium small mb-1" style={{ color: "#343A40" }}>
                    {msg.senderName}
                  </p>
                )} 
                <p className="small mb-1">{msg.message}</p>
                <p className="text-muted small mb-0 text-end" style={{ 
                  color: msg.senderId === userId ? "rgba(255,255,255,0.7) !important" : "" 
                }}>
                  {msg.time}
                </p> 
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
  
        <div className="p-3 border-top border-secondary" style={{ backgroundColor: "#FFFFFF" }}> 
          <div className="d-flex">
            <input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              type="text"
              className="form-control"
              placeholder="Type a message..."
              style={{ height: '40px', flexGrow: 1, backgroundColor: "#F8F9FA", color: "#343A40", borderColor: "#CED4DA" }}
            />
            <button 
              onClick={sendMessage} 
              className="btn btn-primary ms-2" 
              style={{ height: '40px', backgroundColor: "#00C7BE", borderColor: "#00C7BE" }}
            >
              <i className="bi bi-send"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };
export default Chat;